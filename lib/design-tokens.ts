/**
 * Design tokens for consistent spacing and styling across templates
 */

export const SPACING = {
  section: {
    sm: 48,
    md: 80,
    lg: 120,
  },
  heading: {
    marginBottom: 24,
  },
  text: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
} as const

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const

