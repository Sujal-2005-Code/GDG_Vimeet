// Shown while the lazy-loaded admin chunk downloads (main.jsx).
const AdminFallback = () => (
  <div className="flex min-h-dvh items-center justify-center bg-surface-2" role="status">
    <span className="size-8 animate-spin rounded-full border-2 border-line border-t-primary" />
    <span className="sr-only">Loading admin…</span>
  </div>
);

export default AdminFallback;
