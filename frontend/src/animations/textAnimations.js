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

const getStaggerDelay = (anime, value) => (
  typeof anime?.stagger === 'function' ? anime.stagger(value) : value
)

const runAnimation = async (targets, parameters) => {
  if (prefersReducedMotion() || !targets.length) return null

  try {
    const anime = await loadAnime()
    if (!anime?.animate) return null

    const resolvedParameters = { ...parameters }
    if (resolvedParameters.delay?.then) resolvedParameters.delay = await resolvedParameters.delay

    return anime.animate(targets, resolvedParameters)
  } catch {
    return null
  }
}

export const animateTextReveal = async (selector, options = {}) => {
  const targets = getTargets(selector)
  if (prefersReducedMotion() || !targets.length) return null

  try {
    const anime = await loadAnime()
    if (!anime?.animate) return null

    const {
      split = 'chars',
      duration,
      delay = 45,
      ease = 'easeOutCubic',
      stagger: staggerDelay = delay,
      ...animationOptions
    } = options
    let animationTargets = targets

    if (split) {
      const splitType = split === 'words' ? 'words' : 'chars'
      if (typeof anime.splitText === 'function') {
        try {
          const splitter = anime.splitText(
            targets[0],
            splitType === 'words' ? { words: true } : { chars: true },
          )
          const splitTargets = splitType === 'words' ? splitter.words : splitter.chars
          if (splitTargets?.length) animationTargets = splitTargets
        } catch {
          animationTargets = targets
        }
      }
    }

    return anime.animate(animationTargets, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: getDuration(duration, 650),
      ease,
      delay: getStaggerDelay(anime, staggerDelay),
      ...animationOptions,
    })
  } catch {
    return null
  }
}

export const animateHeading = async (selector, options = {}) => {
  const targets = getTargets(selector)
  if (prefersReducedMotion() || !targets.length) return null

  try {
    const anime = await loadAnime()
    if (!anime?.animate) return null

    const {
      split = 'chars',
      duration,
      delay = 35,
      ease = 'easeOutCubic',
      stagger: staggerDelay = delay,
      ...animationOptions
    } = options
    let animationTargets = targets

    if (split) {
      const splitType = split === 'words' ? 'words' : 'chars'
      if (typeof anime.splitText === 'function') {
        try {
          const splitter = anime.splitText(
            targets[0],
            splitType === 'words' ? { words: true } : { chars: true },
          )
          const splitTargets = splitType === 'words' ? splitter.words : splitter.chars
          if (splitTargets?.length) animationTargets = splitTargets
        } catch {
          animationTargets = targets
        }
      }
    }

    return anime.animate(animationTargets, {
      opacity: [0, 1],
      translateY: [18, 0],
      duration: getDuration(duration, 700),
      ease,
      delay: getStaggerDelay(anime, staggerDelay),
      ...animationOptions,
    })
  } catch {
    return null
  }
}

export const animateStaggerItems = async (selector, options = {}) => {
  const targets = getTargets(selector)
  const {
    duration,
    delay = 60,
    ease = 'easeOutCubic',
    stagger: staggerDelay = delay,
    ...animationOptions
  } = options
  const anime = await loadAnime()
  const staggerValue = typeof anime?.stagger === 'function' ? anime.stagger(staggerDelay) : staggerDelay

  return runAnimation(targets, {
    opacity: [0, 1],
    translateY: [18, 0],
    duration: getDuration(duration, 600),
    ease,
    delay: staggerValue,
    ...animationOptions,
  })
}
