import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Header } from "./Header";
import { CartDrawer } from "./CartDrawer";
import { AuthModal } from "./AuthModal";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { apiClient } from "@/lib/api";

export const Layout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { token, user, setSession, clearSession } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const currentUserQuery = useQuery({
    queryKey: ["auth", "me", token],
    queryFn: () => apiClient.getCurrentUser(token as string),
    enabled: Boolean(token),
    retry: false,
  });

  useEffect(() => {
    if (currentUserQuery.data && token) {
      setSession({
        token,
        user: currentUserQuery.data,
      });
    }
  }, [currentUserQuery.data, setSession, token]);

  useEffect(() => {
    if (!token || !currentUserQuery.error) {
      return;
    }
    clearSession();
    toast.error("Your session has expired. Please sign in again.");
  }, [clearSession, currentUserQuery.error, token]);

  const authMutation = useMutation({
    mutationFn: async (payload: { mode: "login" | "register"; name?: string; email: string; password: string }) => {
      if (payload.mode === "register") {
        return apiClient.register({
          name: payload.name ?? "",
          email: payload.email,
          password: payload.password,
        });
      }
      return apiClient.login({
        email: payload.email,
        password: payload.password,
      });
    },
    onSuccess: (data) => {
      setSession(data);
      setAuthOpen(false);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(`Welcome${data.user.name ? `, ${data.user.name}` : ""}.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Authentication failed");
    },
  });

  const handleCheckoutNav = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header
        isAuthenticated={Boolean(user)}
        isAdmin={user?.role === "ADMIN"}
        userName={user?.name}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        onLogout={() => {
          clearSession();
          toast.success("You have been signed out.");
        }}
      />

      <CartDrawer
        open={cartOpen}
        checkoutPending={false}
        isAuthenticated={Boolean(user)}
        userName={user?.name}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckoutNav}
        onOpenAuth={() => {
          setCartOpen(false);
          setAuthOpen(true);
        }}
      />

      <AuthModal
        open={authOpen}
        loading={authMutation.isPending}
        onClose={() => setAuthOpen(false)}
        onSubmit={async (payload) => {
          await authMutation.mutateAsync(payload);
        }}
      />

      <main style={{ flex: 1, paddingBottom: "4rem" }}>
        <Outlet />
      </main>

      <footer style={{ padding: "3rem", textAlign: "center", borderTop: "1px solid var(--noir-red)", marginTop: "auto", background: "var(--background)", zIndex: 10 }}>
        <div style={{ fontWeight: 400, marginBottom: "0.5rem", fontSize: "1.5rem", fontFamily: "var(--font-display)", letterSpacing: "0.15em", textShadow: "0 0 10px var(--noir-red)" }}>NOIRSANE</div>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", fontStyle: "italic" }}>Enter the shadows. All rights reserved.</p>
      </footer>
    </div>
  );
};
