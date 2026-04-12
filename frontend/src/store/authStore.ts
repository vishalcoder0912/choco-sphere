import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApiUser } from "@/lib/api";

interface AuthState {
  token: string | null;
  user: ApiUser | null;
  setSession: (payload: { token: string; user: ApiUser }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: ({ token, user }) => set({ token, user }),
      clearSession: () => set({ token: null, user: null }),
    }),
    {
      name: "choco-sphere-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
