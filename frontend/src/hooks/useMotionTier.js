import { useSyncExternalStore } from 'react';
import { getMotionTier, subscribeToTier } from '../animations/motion';

/**
 * 'full' | 'lite' | 'static' — see animations/motion.js. Re-renders when the
 * visitor changes their reduced-motion setting or resizes across the
 * desktop breakpoint.
 */
export const useMotionTier = () =>
  useSyncExternalStore(subscribeToTier, getMotionTier, () => 'static');

export default useMotionTier;
