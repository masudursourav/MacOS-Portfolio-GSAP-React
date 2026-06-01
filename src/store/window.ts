import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "../constants";

type WindowKey = keyof typeof WINDOW_CONFIG;

type WindowStore = {
  windows: typeof WINDOW_CONFIG;
  nextZIndex: number;
  openWindow: (windowKey: WindowKey, data?: unknown) => void;
  closeWindow: (windowKey: WindowKey) => void;
  focusWindow: (windowKey: WindowKey) => void;
};

const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,
    openWindow: (windowKey: WindowKey, data = null) =>
      set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = true;
        win.zIndex = state.nextZIndex;
        win.data = (data ?? win.data) as never;
        state.nextZIndex += 1;
      }),
    closeWindow: (windowKey: WindowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
      }),
    focusWindow: (windowKey: WindowKey) =>
      set((state) => {
        const win = state.windows[windowKey];
        win.zIndex = state.nextZIndex;
        state.nextZIndex += 1;
      }),
  })),
);

export default useWindowStore;
