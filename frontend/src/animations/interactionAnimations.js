let animePromise

const isElement = value => value && typeof value === 'object' && value.nodeType === 1

const getTargets = target => {
  if (typeof document === 'undefined' || target == null) return []

  try {
    if (typeof target === 'string') return Array.from(document.querySelectorAll(target))
    if (Array.isArray(target)) return target.filter(isElement)
    if (typeof NodeList !== 'undefined' && target instanceof NodeList) return Array.from(target)
    if (typeof target.length === 'number') return Array.from(target).filter(isElement)
    return isElement(target) ? [target] : []
  } catch {
    return []
  }
}

const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false

  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

const loadAnime = () => {
  if (!animePromise) animePromise = import('animejs').catch(() => null)
  return animePromise
}

const getDuration = (duration, fallback) => {
  const value = Number(duration)
  return Number.isFinite(value) ? Math.min(800, Math.max(300, value)) : fallback
}

const runAnimation = async (targets, parameters) => {
  if (prefersReducedMotion() || !targets.length) return null

  try {
    const anime = await loadAnime()
    if (!anime?.animate) return null
    return anime.animate(targets, parameters)
  } catch {
    return null
  }
}

export const animateNavItem = async element => runAnimation(getTargets(element), {
  opacity: [0.72, 1],
  translateY: [0, -2],
  duration: 300,
  ease: 'easeOutCubic',
})

export const animateNavItemOut = async element => runAnimation(getTargets(element), {
  opacity: [1, 0.72],
  translateY: [-2, 0],
  duration: 300,
  ease: 'easeInOutCubic',
})

export const animateButtonHover = async element => runAnimation(getTargets(element), {
  scale: 1.03,
  translateY: -1,
  duration: 300,
  ease: 'easeOutCubic',
})

export const animateButtonHoverOut = async element => runAnimation(getTargets(element), {
  scale: 1,
  translateY: 0,
  duration: 300,
  ease: 'easeInOutCubic',
})

export const animateMobileMenuOpen = async element => runAnimation(getTargets(element), {
  opacity: [0, 1],
  translateX: ['100%', '0%'],
  duration: 450,
  ease: 'easeInOutCubic',
})

export const animateMobileMenuClose = async element => runAnimation(getTargets(element), {
  opacity: [1, 0],
  translateX: ['0%', '100%'],
  duration: 450,
  ease: 'easeInOutCubic',
})

export const animateStaggerMenuItems = async (elements, options = {}) => {
  const targets = getTargets(elements)
  const {
    duration,
    delay = 35,
    ease = 'easeOutCubic',
    stagger: staggerDelay = delay,
    ...animationOptions
  } = options
  const anime = await loadAnime()
  const staggerValue = typeof anime?.stagger === 'function' ? anime.stagger(staggerDelay) : staggerDelay

  return runAnimation(targets, {
    opacity: [0, 1],
    translateX: [-16, 0],
    duration: getDuration(duration, 350),
    ease,
    delay: staggerValue,
    ...animationOptions,
  })
}
