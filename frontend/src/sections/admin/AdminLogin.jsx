import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/adminAuth';
import { useAdminSession } from '../../hooks/useAdminSession';
import { site } from '../../data/site';

const { logo } = site.brand;

const FullScreenSpinner = () => (
  <div className="min-h-dvh bg-surface-2 flex items-center justify-center">
    <span className="size-8 rounded-full border-2 border-line-strong border-t-primary animate-spin" />
  </div>
);

const AdminLogin = () => {
  const { status } = useAdminSession();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already logged in (e.g. returning admin, persisted session) — skip the form.
  if (status === 'authenticated') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (status === 'loading') {
    return <FullScreenSpinner />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);

    const result = await adminLogin(username.trim(), password);

    if (!result.success) {
      setIsSubmitting(false);
      setError(result.error);
      return;
    }

    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <main className="min-h-dvh bg-surface-2 text-ink flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <svg viewBox={logo.markViewBox} aria-hidden="true" focusable="false" className="mx-auto mb-4 h-10 w-auto">
            <use href={`${logo.src}#${logo.markId}`} />
          </svg>
          <h1 className="text-xl font-semibold text-ink">GDG ViMEET Admin</h1>
          <p className="text-sm text-ink-2 mt-1">Sign in to manage recruitment applications.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-surface p-6 sm:p-7 shadow-rest"
        >
          {error && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-lg bg-danger-tint border border-danger/30 text-danger text-sm"
            >
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="admin-username" className="block text-sm font-medium text-ink mb-1.5">
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-2/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
              placeholder="Enter admin username"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="admin-password" className="block text-sm font-medium text-ink mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-2/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white font-semibold px-6 py-2.5 text-sm hover:bg-primary-strong transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-ink-2 mt-6">
          GDG ViMEET Core Team access only.
        </p>
      </div>
    </main>
  );
};

export default AdminLogin;
