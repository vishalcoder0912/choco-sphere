import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  FolderTree,
  Users,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAuthStore } from "@/store/authStore";
import { apiClient, type Order } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const formatINR = (cents: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(cents / 100);

const STATUS_VARIANT: Record<Order["status"], string> = {
  PENDING: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30 dark:text-yellow-400",
  PAID: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  SHIPPED: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
  DELIVERED: "bg-violet-500/15 text-violet-600 border-violet-500/30 dark:text-violet-400",
  CANCELLED: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  hint,
  loading,
}: {
  label: string;
  value: string | number;
  icon: typeof IndianRupee;
  hint?: string;
  loading?: boolean;
}) => (
  <Card className="overflow-hidden">
    <CardContent className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <Skeleton className="h-7 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-semibold tracking-tight truncate">{value}</p>
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { token } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => apiClient.adminGetStats(token as string),
    enabled: Boolean(token),
    refetchInterval: 30000,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => apiClient.adminGetOrders(token as string),
    enabled: Boolean(token),
  });

  const recentOrders = useMemo(() => orders.slice(0, 6), [orders]);

  const chartData = useMemo(
    () =>
      (stats?.trend ?? []).map((d) => ({
        ...d,
        revenueRupees: d.revenue / 100,
        label: new Date(d.date).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
      })),
    [stats]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Live overview of your store performance.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Revenue"
          value={stats ? formatINR(stats.totalRevenue) : "—"}
          icon={IndianRupee}
          loading={statsLoading}
          hint="Excludes cancelled"
        />
        <StatCard
          label="Orders"
          value={stats?.totalOrders ?? 0}
          icon={ShoppingBag}
          loading={statsLoading}
          hint={`${stats?.pendingOrders ?? 0} pending`}
        />
        <StatCard
          label="Products"
          value={stats?.totalProducts ?? 0}
          icon={Package}
          loading={statsLoading}
        />
        <StatCard
          label="Categories"
          value={stats?.totalCategories ?? 0}
          icon={FolderTree}
          loading={statsLoading}
        />
        <StatCard
          label="Customers"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          loading={statsLoading}
        />
      </div>

      {/* Chart + Order status mix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Revenue — last 7 days
                </CardTitle>
                <CardDescription>Daily revenue (₹)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {statsLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 8, bottom: 0, left: -10 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenueRupees"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#rev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Order Status
            </CardTitle>
            <CardDescription>Live distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {([
                  ["Pending", stats?.pendingOrders ?? 0, "PENDING"],
                  ["Paid", stats?.paidOrders ?? 0, "PAID"],
                  ["Shipped", stats?.shippedOrders ?? 0, "SHIPPED"],
                  ["Delivered", stats?.deliveredOrders ?? 0, "DELIVERED"],
                  ["Cancelled", stats?.cancelledOrders ?? 0, "CANCELLED"],
                ] as const).map(([label, count, key]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-md border bg-background px-3 py-2"
                  >
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full border",
                        STATUS_VARIANT[key as Order["status"]]
                      )}
                    >
                      {label}
                    </span>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <CardDescription>Latest customer activity</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/orders" className="flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))}
              {!ordersLoading && recentOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
              {!ordersLoading &&
                recentOrders.map((order) => (
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
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("border", STATUS_VARIANT[order.status])}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatINR(order.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
