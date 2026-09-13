import { Navigate } from 'react-router-dom';
import { useAdminSession } from '../../hooks/useAdminSession';
import AdminLayout from './AdminLayout';

/**
 * Wraps a protected admin page. Renders nothing admin-related until the
 * backend has confirmed the session cookie is valid — an unauthenticated
 * visitor is redirected to /admin before any admin UI or data ever mounts.
 */
const AdminGate = ({ children }) => {
  const { status, username } = useAdminSession();

  if (status === 'loading') {
    return (
      <div className="min-h-dvh bg-[#0b0b0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white/60">
          <span className="size-8 rounded-full border-2 border-white/15 border-t-white animate-spin" />
          <p className="text-sm">Checking admin session…</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin" replace />;
  }

  return <AdminLayout username={username}>{children}</AdminLayout>;
};

export default AdminGate;
