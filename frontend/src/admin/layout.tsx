import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronRight,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badgeKey?: "pending";
  end?: boolean;
};

const navItems: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, badgeKey: "pending" },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
];

const labelFor = (path: string) => {
  const item = navItems.find((n) =>
    n.end ? path === n.to : path === n.to || path.startsWith(`${n.to}/`)
  );
  return item?.label ?? "Admin";
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, clearSession } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = Boolean(user && token && user.role === "ADMIN");

  const { data: orders = [] } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => apiClient.adminGetOrders(token as string),
    enabled: isAdmin,
    refetchInterval: 30000,
  });

  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === "PENDING").length,
    [orders]
  );

  // Guard: redirect non-admins (after all hooks)
  if (!isAdmin || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/15 text-destructive flex items-center justify-center">
            <X className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-semibold">Access Restricted</h1>
          <p className="text-muted-foreground">
            You need admin privileges to access this area.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => navigate("/")} variant="default">
              Back to Store
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const initials = (user.name || user.email)
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const renderNav = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-1 px-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "bg-primary/15 text-primary border border-primary/20"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )
          }
        >
          <item.icon className="w-4 h-4 shrink-0" />
          <span className="flex-1">{item.label}</span>
          {item.badgeKey === "pending" && pendingCount > 0 && (
            <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
              {pendingCount > 99 ? "99+" : pendingCount}
            </Badge>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 h-16 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-full items-center gap-3 px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <Link to="/" className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Store</span>
          </Link>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-md bg-primary/15 text-primary flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold leading-tight truncate">
                NOIRSANE Admin
              </h1>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Admin</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground/80">{labelFor(location.pathname)}</span>
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {pendingCount > 0 && (
              <Badge
                variant="secondary"
                className="hidden md:inline-flex"
              >
                {pendingCount} pending
              </Badge>
            )}
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                clearSession();
                toast.success("Signed out");
                navigate("/");
              }}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 border-r bg-card sticky top-16 h-[calc(100vh-4rem)]">
          <div className="flex flex-col w-full">
            <div className="px-4 py-4">
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-2 mb-2">
                Management
              </p>
              {renderNav()}
            </div>
            <Separator />
            <div className="mt-auto p-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground/80 truncate">{user.name}</p>
              <p className="truncate">{user.email}</p>
            </div>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="fixed left-0 top-0 z-50 h-full w-72 bg-card border-r shadow-xl md:hidden animate-in slide-in-from-left duration-200">
              <div className="h-16 px-4 flex items-center justify-between border-b">
                <span className="font-semibold">Admin Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100%-4rem)] py-4">
                {renderNav(() => setMobileOpen(false))}
              </ScrollArea>
            </aside>
          </>
        )}

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
