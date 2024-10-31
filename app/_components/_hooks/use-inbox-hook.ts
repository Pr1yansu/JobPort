import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface InboxModal {
  isShown: boolean;
  isOpen: boolean;
  open: () => void;
  onShow: () => void;
  onClose: () => void;
}

export const useInboxModal = create(
  persist<InboxModal>(
    (set) => ({
      isShown: false, // Default value for the first time user logs in
      isOpen: false,

      open: () => set({ isOpen: true }),

      onClose: () => set({ isOpen: false }),

      onShow: () => set({ isShown: true }),
    }),
    {
      name: "inbox-modal-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
