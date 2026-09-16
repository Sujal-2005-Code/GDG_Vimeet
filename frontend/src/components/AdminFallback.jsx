// Shown while the lazy-loaded admin chunk downloads (main.jsx).
const AdminFallback = () => (
  <div className="min-h-dvh bg-[#0b0b0d] flex items-center justify-center">
    <span className="size-8 rounded-full border-2 border-white/15 border-t-white animate-spin" />
  </div>
);

export default AdminFallback;
