// `motion` is used via JSX (<motion.div>) — this project's eslint config has no JSX-usage rule for lowercase imports.
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, useTransform } from 'motion/react';
import { useEffect, useState } from 'react';
import './Stack.css';

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
};

function CardRotate({ children, onSendToBack, sensitivity, disableDrag = false, disableTilt = false }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], disableTilt ? [0, 0] : [60, -60]);
  const rotateY = useTransform(x, [-100, 100], disableTilt ? [0, 0] : [-60, 60]);

  function handleDragEnd(_, info) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  if (disableDrag) {
    return (
      <motion.div className="card-rotate-disabled" style={{ x: 0, y: 0 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card-rotate"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;
  const effectiveAutoplay = autoplay && !prefersReducedMotion;

  // `cards` should be a stable reference (memoized by the caller) so this
  // doesn't reset drag/autoplay progress on every parent re-render.
  const [stack, setStack] = useState(() => cards.map((content, index) => ({ id: index + 1, content })));

  useEffect(() => {
    setStack(cards.map((content, index) => ({ id: index + 1, content })));
  }, [cards]);

  const sendToBack = (id) => {
    setStack((prev) => {
      const newStack = [...prev];
      const index = newStack.findIndex((card) => card.id === id);
      if (index === -1) return prev;
      const [card] = newStack.splice(index, 1);
      newStack.unshift(card);
      return newStack;
    });
  };

  useEffect(() => {
    if (effectiveAutoplay && stack.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        const topCardId = stack[stack.length - 1].id;
        sendToBack(topCardId);
      }, autoplayDelay);

      return () => clearInterval(interval);
    }
  }, [effectiveAutoplay, autoplayDelay, stack, isPaused]);

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      sendToBack(id);
    }
  };

  return (
    <div
      className="stack-container"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {stack.map((card, index) => {
        const isTop = index === stack.length - 1;
        const randomRotate = randomRotation && !prefersReducedMotion ? Math.random() * 10 - 5 : 0;
        const fanRotation = prefersReducedMotion ? 0 : (stack.length - index - 1) * 4;

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag || prefersReducedMotion}
            disableTilt={prefersReducedMotion}
          >
            <motion.div
              className="card"
              role={isTop && shouldEnableClick ? 'button' : undefined}
              tabIndex={isTop && shouldEnableClick ? 0 : undefined}
              aria-label={isTop && shouldEnableClick ? 'Show next photo' : undefined}
              onClick={() => shouldEnableClick && sendToBack(card.id)}
              onKeyDown={(e) => shouldEnableClick && handleKeyDown(e, card.id)}
              animate={{
                rotateZ: fanRotation + randomRotate,
                scale: 1 + index * 0.06 - stack.length * 0.06,
                transformOrigin: '90% 90%',
              }}
              initial={false}
              transition={{
                type: prefersReducedMotion ? 'tween' : 'spring',
                duration: prefersReducedMotion ? 0.15 : undefined,
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
