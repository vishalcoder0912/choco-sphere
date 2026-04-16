import { create } from "zustand";

interface CartDrawerStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCartDrawerStore = create<CartDrawerStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
