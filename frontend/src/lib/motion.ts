// ─── Framer Motion Design Tokens ───────────────────────────────────────
// All motion in NETS follows these rules:
// - Maximum duration: 300ms
// - No bounce, spin, float, or parallax
// - Motion supports usability — never decoration

import type { Variants, Transition } from 'framer-motion'

export const transition: Record<string, Transition> = {
  fast:    { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  default: { duration: 0.2,  ease: [0.4, 0, 0.2, 1] },
  slow:    { duration: 0.3,  ease: [0.4, 0, 0.2, 1] },
  enter:   { duration: 0.25, ease: [0, 0, 0.2, 1] },
}

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
}

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
}

export const slideInLeft: Variants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
}

export const slideInRight: Variants = {
  hidden:  { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
}

export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
}
