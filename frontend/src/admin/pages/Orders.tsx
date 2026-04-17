import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Trash2, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { apiClient, type Order } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formatINR = (cents: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(cents / 100);

const STATUSES: Order["status"][] = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_VARIANT: Record<Order["status"], string> = {
  PENDING: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30 dark:text-yellow-400",
  PAID: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  SHIPPED: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
  DELIVERED: "bg-violet-500/15 text-violet-600 border-violet-500/30 dark:text-violet-400",
  CANCELLED: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
};

const Orders = () => {
  const { token } = useAuthStore();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | Order["status"]>("ALL");
  const [viewing, setViewing] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState<Order | null>(null);

  const {
    data: orders = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => apiClient.adminGetOrders(token as string),
    enabled: Boolean(token),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiClient.adminUpdateOrderStatus(token as string, id, status),
    onSuccess: () => {
      toast.success("Order status updated");
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeOrder = useMutation({
    mutationFn: (id: number) => apiClient.adminDeleteOrder(token as string, id),
    onSuccess: () => {
      toast.success("Order deleted");
      setDeleting(null);
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const matchesStatus = filter === "ALL" || o.status === filter;
        const q = search.trim().toLowerCase();
        const matchesSearch =
          !q ||
          String(o.id).includes(q) ||
          (o.user?.name ?? "").toLowerCase().includes(q) ||
          (o.user?.email ?? "").toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
      }),
    [orders, filter, search]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {orders.length} total · {filtered.length} shown
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isFetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, name, or email…"
              className="pl-9"
            />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden sm:table-cell">Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No orders match your filters.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.user?.name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.user?.email ?? "—"}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      {order.items.length}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(v) =>
                          updateStatus.mutate({ id: order.id, status: v })
                        }
                      >
                        <SelectTrigger className="h-8 w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              <Badge
                                variant="outline"
                                className={cn("border mr-1", STATUS_VARIANT[s])}
                              >
                                {s}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatINR(order.totalAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewing(order)}
                          aria-label="View order"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleting(order)}
                          aria-label="Delete order"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View order sheet */}
      <Sheet open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {viewing && (
            <>
              <SheetHeader>
                <SheetTitle>Order #{viewing.id}</SheetTitle>
                <SheetDescription>
                  Placed{" "}
                  {viewing.createdAt
                    ? new Date(viewing.createdAt).toLocaleString("en-IN")
                    : "—"}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Customer
                  </p>
                  <p className="font-medium">{viewing.user?.name ?? "—"}</p>
                  <p className="text-sm text-muted-foreground">{viewing.user?.email}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Items
                  </p>
                  <div className="space-y-2">
                    {viewing.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-md border p-2"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatINR(item.product.price)} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatINR(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Shipping address
                    </p>
                    <p className="text-sm">{viewing.shippingAddress || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Payment
                    </p>
                    <p className="text-sm">
                      {viewing.paymentMethod || "—"}
                      {viewing.paymentDetails?.upiId && (
                        <span className="text-muted-foreground">
                          {" "}
                          · {viewing.paymentDetails.upiId}
                        </span>
                      )}
                      {viewing.paymentDetails?.last4 && (
                        <span className="text-muted-foreground">
                          {" "}
                          · ****{viewing.paymentDetails.last4}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-xl font-semibold">
                    {formatINR(viewing.totalAmount)}
                  </span>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete order #{deleting?.id}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the order and all of its line items. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleting && removeOrder.mutate(deleting.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Orders;
