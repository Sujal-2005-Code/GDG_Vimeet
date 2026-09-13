import { useCallback, useEffect, useState } from 'react';
import { adminMe } from '../services/adminAuth';

/**
 * Source of truth for "is an admin logged in", backed entirely by the
 * backend's httpOnly session cookie (checked via GET /api/admin/me).
 * There is no local/derived notion of admin status.
 */
export const useAdminSession = () => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'
  const [username, setUsername] = useState(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    const result = await adminMe();
    if (result.authenticated) {
      setUsername(result.username);
      setStatus('authenticated');
    } else {
      setUsername(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { status, username, refresh };
};

export default useAdminSession;
