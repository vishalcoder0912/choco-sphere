import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { OrderHistory } from "@/components/OrderHistory";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api";
import styles from "./Index.module.css";

const Account = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const ordersQuery = useQuery({
    queryKey: ["orders", user?.id, token],
    queryFn: () => apiClient.getOrdersByUser(user!.id, token as string),
    enabled: Boolean(user && token),
    retry: false,
  });

  if (!user) {
    return null; // Redirecting...
  }

  return (
    <div style={{ padding: "8rem 2rem 4rem", maxWidth: "1280px", margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className={styles.sectionTitle} style={{ textAlign: "center" }}>My Account</h1>
        <p className={styles.sectionSubtitle} style={{ textAlign: "center", marginBottom: "3rem" }}>
          Welcome back, {user.name}. Here you can view your past orders.
        </p>
      </motion.div>

      <section className={styles.ordersWrap} style={{ marginTop: 0 }}>
        <OrderHistory
          orders={ordersQuery.data ?? []}
          loading={ordersQuery.isLoading}
          errorMessage={ordersQuery.error instanceof Error ? ordersQuery.error.message : undefined}
          onRefresh={() => ordersQuery.refetch()}
        />
      </section>
    </div>
  );
};

export default Account;
