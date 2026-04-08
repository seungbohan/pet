import { create } from 'zustand';

let toastIdCounter = 0;

const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: (message, type = 'info') => {
    const id = ++toastIdCounter;
    const toast = { id, message, type };

    set((state) => {
      // Keep max 3 toasts visible — remove oldest if exceeding
      const updated = [...state.toasts, toast];
      if (updated.length > 3) {
        return { toasts: updated.slice(updated.length - 3) };
      }
      return { toasts: updated };
    });

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

export default useToastStore;
