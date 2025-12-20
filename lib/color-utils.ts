/**
 * Color utility functions for accessibility and design consistency
 */

/**
 * Parse a hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Calculate relative luminance of a color (WCAG formula)
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0

  const { r, g, b } = rgb
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  )

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Determine if a color is "light" (should use dark text)
 * Returns true if the color is light, false if dark
 */
export function isLightColor(hex: string): boolean {
  return getLuminance(hex) > 0.179
}

/**
 * Get the appropriate contrast text color for a background
 * Returns either light or dark color based on background luminance
 */
export function getContrastTextColor(
  backgroundColor: string,
  lightText: string = '#ffffff',
  darkText: string = '#1a1a1a'
): string {
  if (!backgroundColor || backgroundColor === 'transparent') {
    return darkText
  }
  return isLightColor(backgroundColor) ? darkText : lightText
}

/**
 * Adjust color brightness
 * @param hex - The hex color
 * @param percent - Negative to darken, positive to lighten (-100 to 100)
 */
export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const adjust = (c: number) => {
    const adjusted = c + (c * percent) / 100
    return Math.max(0, Math.min(255, Math.round(adjusted)))
  }

  const r = adjust(rgb.r).toString(16).padStart(2, '0')
  const g = adjust(rgb.g).toString(16).padStart(2, '0')
  const b = adjust(rgb.b).toString(16).padStart(2, '0')

  return `#${r}${g}${b}`
}

/**
 * Create a semi-transparent version of a color
 */
export function withOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
}

