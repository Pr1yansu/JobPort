import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface Section {
  isOpen: boolean;
  open: (section: Doc<"sections"> | undefined | null) => void;
  close: () => void;
  section: Doc<"sections"> | undefined | null;
}

export const useAddSections = create<Section>((set) => ({
  isOpen: false,
  section: undefined,
  open: (section: Doc<"sections"> | undefined | null) =>
    set({ isOpen: true, section: section }),
  close: () => set({ isOpen: false }),
}));
