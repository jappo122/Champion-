// Mobile nav drawer state — a tiny module store so the hamburger button (in the
// header) and the drawer (MobileNav) share state without relying on a window
// global that only exists after MobileNav's effect runs. A click on the button
// ALWAYS toggles the store; the drawer reads the store. This makes the menu
// immune to mount-timing/hydration races that previously left the hamburger
// silently dead.
type Listener = () => void;

let open = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export const mobileNavStore = {
  toggle() {
    open = !open;
    emit();
  },
  open() {
    if (!open) {
      open = true;
      emit();
    }
  },
  close() {
    if (open) {
      open = false;
      emit();
    }
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot() {
    return open;
  },
};
