import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Bookmark = {
  id: string;
};

type State = {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (bookmarkId: string) => void;
};

export const useBookmark = create<State>()(
  persist(
    (set) => ({
      bookmarks: [],
      addBookmark: (bookmark) =>
        set((state) => ({ bookmarks: [...state.bookmarks, bookmark] })),
      removeBookmark: (bookmarkId) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId),
        })),
    }),
    {
      name: "jobport-bookmarks",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
