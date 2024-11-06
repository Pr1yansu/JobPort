import { create } from "zustand";

type SavingState = {
  saving: boolean;
  setSaving: (saving: boolean) => void;
};

export const useSaving = create<SavingState>((set) => ({
  saving: false,
  setSaving: (saving) => set({ saving }),
}));
