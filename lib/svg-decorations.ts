/**
 * SVG Decoration Library for Orthodox Parish Builder
 * 
 * This file contains decorative SVG elements that can be used throughout the site.
 * All SVGs support dynamic color via the `color` parameter.
 */

// ============================================================================
// DIVIDER STYLES (SVG-based ornate dividers)
// ============================================================================

export type OrnamentDividerStyle = 'diamond' | 'cross' | 'scroll' | 'byzantine'

export const ORNAMENT_DIVIDER_STYLES: { value: OrnamentDividerStyle; label: string }[] = [
  { value: 'diamond', label: 'Diamond Pattern' },
  { value: 'cross', label: 'Cross & Diamonds' },
  { value: 'scroll', label: 'Scroll Pattern' },
  { value: 'byzantine', label: 'Byzantine Diamond' },
]

/**
 * Get divider SVG as data URL for use in CSS/img src
 * @param style - The divider style
 * @param color - Hex color for the divider (e.g., '#C9A962')
 */
export function getDividerSvg(style: OrnamentDividerStyle, color: string): string {
  // Use the actual SVG files from public folder with CSS mask for coloring
  const svgPaths: Record<OrnamentDividerStyle, string> = {
    diamond: '/divider-1.svg',
    cross: '/divider-2.svg',
    scroll: '/divider-3.svg',
    byzantine: '/divider-4.svg',
  }
  
  return svgPaths[style] || ''
}

/**
 * Get inline SVG data URL (legacy - kept for reference but not used)
 * The issue with data URLs is encoding complexity
 */
function getLegacyDividerSvg(style: OrnamentDividerStyle, color: string): string {
  // Convert hex to SVG-safe color
  const safeColor = color.replace('#', '%23')
  
  let svg = ''
  
  switch (style) {
    case 'diamond':
      // Diamond Pattern (divider-1)
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 194 16.32"><g><polygon points="93.47 12.63 95.74 11.53 96.85 12.63 95.74 13.74 93.47 12.63" fill="${safeColor}"/><polygon points="100.84 12.63 98.56 13.74 97.45 12.63 98.56 11.53 100.84 12.63" fill="${safeColor}"/><polygon points="97.15 16.32 96.05 14.04 97.15 12.93 98.26 14.04 97.15 16.32" fill="${safeColor}"/><polygon points="97.15 8.95 98.26 11.22 97.15 12.33 96.05 11.22 97.15 8.95" fill="${safeColor}"/><polygon points="94.05 9.53 95.55 10.05 95.55 11.03 94.57 11.03 94.05 9.53" fill="${safeColor}"/><polygon points="100.13 15.61 98.63 15.09 98.63 14.11 99.61 14.11 100.13 15.61" fill="${safeColor}"/><polygon points="94.05 15.61 94.57 14.11 95.55 14.11 95.55 15.09 94.05 15.61" fill="${safeColor}"/><polygon points="100.13 9.53 99.61 11.03 98.63 11.03 98.63 10.05 100.13 9.53" fill="${safeColor}"/><polygon points="93.47 3.69 95.74 2.58 96.85 3.69 95.74 4.79 93.47 3.69" fill="${safeColor}"/><polygon points="100.84 3.69 98.56 4.79 97.45 3.69 98.56 2.58 100.84 3.69" fill="${safeColor}"/><polygon points="97.15 7.37 96.05 5.09 97.15 3.99 98.26 5.09 97.15 7.37" fill="${safeColor}"/><polygon points="97.15 0 98.26 2.28 97.15 3.38 96.05 2.28 97.15 0" fill="${safeColor}"/><polygon points="94.05 .59 95.55 1.11 95.55 2.09 94.57 2.09 94.05 .59" fill="${safeColor}"/><polygon points="100.13 6.67 98.63 6.15 98.63 5.17 99.61 5.17 100.13 6.67" fill="${safeColor}"/><polygon points="94.05 6.67 94.57 5.17 95.55 5.17 95.55 6.15 94.05 6.67" fill="${safeColor}"/><polygon points="100.13 .59 99.61 2.09 98.63 2.09 98.63 1.11 100.13 .59" fill="${safeColor}"/><polygon points="103.62 11.84 102.52 9.57 103.62 8.46 104.73 9.57 103.62 11.84" fill="${safeColor}"/><polygon points="103.62 4.47 104.73 6.75 103.62 7.86 102.52 6.75 103.62 4.47" fill="${safeColor}"/><polygon points="107.31 8.16 105.03 9.26 103.93 8.16 105.03 7.05 107.31 8.16" fill="${safeColor}"/><polygon points="99.94 8.16 102.22 7.05 103.32 8.16 102.22 9.26 99.94 8.16" fill="${safeColor}"/><polygon points="100.53 11.26 101.05 9.76 102.03 9.76 102.03 10.74 100.53 11.26" fill="${safeColor}"/><polygon points="106.6 5.18 106.08 6.68 105.1 6.68 105.1 5.7 106.6 5.18" fill="${safeColor}"/><polygon points="106.6 11.26 105.1 10.74 105.1 9.76 106.08 9.76 106.6 11.26" fill="${safeColor}"/><polygon points="100.53 5.18 102.03 5.7 102.03 6.68 101.05 6.68 100.53 5.18" fill="${safeColor}"/><polygon points="90.68 11.84 89.57 9.57 90.68 8.46 91.78 9.57 90.68 11.84" fill="${safeColor}"/><polygon points="90.68 4.47 91.78 6.75 90.68 7.86 89.57 6.75 90.68 4.47" fill="${safeColor}"/><polygon points="94.36 8.16 92.08 9.26 90.98 8.16 92.08 7.05 94.36 8.16" fill="${safeColor}"/><polygon points="86.99 8.16 89.27 7.05 90.37 8.16 89.27 9.26 86.99 8.16" fill="${safeColor}"/><polygon points="87.58 11.26 88.1 9.76 89.08 9.76 89.08 10.74 87.58 11.26" fill="${safeColor}"/><polygon points="93.66 5.18 93.14 6.68 92.16 6.68 92.16 5.7 93.66 5.18" fill="${safeColor}"/><polygon points="93.66 11.26 92.16 10.74 92.16 9.76 93.14 9.76 93.66 11.26" fill="${safeColor}"/><polygon points="87.58 5.18 89.08 5.7 89.08 6.68 88.1 6.68 87.58 5.18" fill="${safeColor}"/><path d="M182.45,9.13l-72.79,1.2c-.94.02-1.72-.73-1.73-1.68-.02-.94.73-1.72,1.68-1.73.02,0,.04,0,.06,0l72.79,1.2c.28,0,.5.23.49.51,0,.27-.22.49-.49.49Z" fill="${safeColor}"/><polygon points="194 8.63 184.28 3.91 179.57 8.63 184.28 13.34 194 8.63" fill="${safeColor}"/><polygon points="183.02 8.63 176.77 5.6 173.74 8.63 176.77 11.66 183.02 8.63" fill="${safeColor}"/><polygon points="175.79 8.63 172.09 6.83 170.29 8.63 172.09 10.43 175.79 8.63" fill="${safeColor}"/><path d="M11.55,8.13l72.79-1.2c.94-.02,1.72.73,1.73,1.68.02.94-.73,1.72-1.68,1.73-.02,0-.04,0-.06,0l-72.79-1.2c-.28,0-.5-.23-.49-.51,0-.27.22-.49.49-.49Z" fill="${safeColor}"/><polygon points="0 8.63 9.72 13.34 14.43 8.63 9.72 3.91 0 8.63" fill="${safeColor}"/><polygon points="10.98 8.63 17.23 11.66 20.26 8.63 17.23 5.6 10.98 8.63" fill="${safeColor}"/><polygon points="18.21 8.63 21.91 10.43 23.71 8.63 21.91 6.83 18.21 8.63" fill="${safeColor}"/></g></svg>`
      break
      
    case 'cross':
      // Cross & Diamonds (divider-2)
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 194.14 20.72"><g><polygon points="91.14 15.92 93.05 10.4 96.66 10.4 96.66 14.01 91.14 15.92" fill="${safeColor}"/><polygon points="103.16 3.9 101.25 9.42 97.64 9.42 97.64 5.81 103.16 3.9" fill="${safeColor}"/><polygon points="103.16 15.92 97.64 14.01 97.64 10.4 101.25 10.4 103.16 15.92" fill="${safeColor}"/><polygon points="91.14 3.9 96.66 5.81 96.66 9.42 93.05 9.42 91.14 3.9" fill="${safeColor}"/><polygon points="87.04 9.91 90.34 8.32 91.93 9.91 90.34 11.51 87.04 9.91" fill="${safeColor}"/><polygon points="106.87 9.91 103.58 11.51 101.98 9.91 103.58 8.32 106.87 9.91" fill="${safeColor}"/><polygon points="96.96 19.83 95.36 16.53 96.96 14.94 98.55 16.53 96.96 19.83" fill="${safeColor}"/><polygon points="96.96 0 98.55 3.29 96.96 4.89 95.36 3.29 96.96 0" fill="${safeColor}"/><path d="M11.55,9.41l72.79-1.2c-.94.02-1.72.73-1.73,1.68-.02.94.73,1.72,1.68,1.73-.02,0-.04,0-.06,0l-72.79-1.2c-.28,0-.5-.23-.49-.51,0-.27.22-.49.49-.49Z" fill="${safeColor}"/><polygon points="0 9.91 9.72 5.2 14.43 9.91 9.72 14.62 0 9.91" fill="${safeColor}"/><polygon points="8.83 9.91 18.55 5.2 23.26 9.91 18.55 14.62 8.83 9.91" fill="${safeColor}"/><polygon points="17.56 9.91 24.13 6.73 27.31 9.91 24.13 13.09 17.56 9.91" fill="${safeColor}"/><polygon points="24.06 9.91 30.63 6.73 33.81 9.91 30.63 13.09 24.06 9.91" fill="${safeColor}"/><polygon points="29.94 9.91 34.48 7.71 36.68 9.91 34.48 12.11 29.94 9.91" fill="${safeColor}"/><path d="M84.48,4.07c-2.24.14-4.13,1.89-4.43,3.96-.16,1.02,0,2.09.51,2.99.49.9,1.32,1.63,2.24,1.97.96.35,2.12.43,3.27.63.58.11,1.18.22,1.77.46.59.24,1.17.64,1.56,1.22.37.59.49,1.26.49,1.89.02.64-.16,1.29-.47,1.84-.66,1.1-1.92,1.78-3.14,1.68v-.34c1.09-.08,2.07-.74,2.51-1.68.21-.47.33-.97.28-1.48-.04-.52-.17-1.01-.43-1.39-.56-.73-1.64-1-2.73-1.16-1.11-.17-2.28-.21-3.49-.61-2.47-.91-3.88-3.72-3.32-6.2.28-1.23,1-2.34,1.97-3.1.99-.73,2.23-1.11,3.42-1.02v.34Z" fill="${safeColor}"/><path d="M182.59,10.41l-72.79,1.2c-.94.02-1.72-.73-1.73-1.68-.02-.94.73-1.72,1.68-1.73.02,0,.04,0,.06,0l72.79,1.2c.28,0,.5.23.49.51,0,.27-.22.49-.49.49Z" fill="${safeColor}"/><polygon points="194.14 9.91 184.43 5.2 179.71 9.91 184.43 14.62 194.14 9.91" fill="${safeColor}"/><polygon points="185.31 9.91 175.59 5.2 170.88 9.91 175.59 14.62 185.31 9.91" fill="${safeColor}"/><polygon points="176.58 9.91 170.02 6.73 166.83 9.91 170.02 13.09 176.58 9.91" fill="${safeColor}"/><polygon points="170.08 9.91 163.52 6.73 160.33 9.91 163.52 13.09 170.08 9.91" fill="${safeColor}"/><polygon points="164.21 9.91 159.66 7.71 157.46 9.91 159.66 12.11 164.21 9.91" fill="${safeColor}"/><path d="M109.66,3.72c1.19-.09,2.42.29,3.42,1.02.98.76,1.69,1.86,1.97,3.1.57,2.48-.84,5.29-3.32,6.2-1.22.41-2.39.44-3.49.61-1.09.16-2.17.43-2.73,1.16-.26.38-.4.86-.43,1.39-.06.51.07,1.01.28,1.48.43.94,1.42,1.6,2.51,1.68v.34c-1.22.09-2.48-.58-3.14-1.68-.32-.55-.5-1.2-.47-1.84,0-.62.12-1.29.49-1.89.39-.58.97-.98,1.56-1.22.6-.24,1.19-.35,1.77-.46,1.16-.19,2.31-.28,3.27-.63.91-.34,1.75-1.07,2.24-1.97.52-.9.67-1.96.51-2.99-.3-2.07-2.2-3.82-4.43-3.96v-.34Z" fill="${safeColor}"/></g></svg>`
      break
      
    case 'scroll':
      // Scroll Pattern (divider-3)
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 194 24.93"><g><path d="M11.55,15.92l72.79-1.2c.94-.02,1.72.73,1.73,1.68.02.94-.73,1.72-1.68,1.73-.02,0-.04,0-.06,0l-72.79-1.2c-.28,0-.5-.23-.49-.51,0-.27.22-.49.49-.49Z" fill="${safeColor}"/><polygon points="0 16.42 9.72 11.71 14.43 16.42 9.72 21.14 0 16.42" fill="${safeColor}"/><polygon points="88.65 16.42 93.9 13.87 96.45 16.42 93.9 18.97 88.65 16.42" fill="${safeColor}"/><polygon points="105.66 16.42 100.4 18.97 97.85 16.42 100.4 13.87 105.66 16.42" fill="${safeColor}"/><polygon points="97.15 24.93 94.6 19.67 97.15 17.12 99.7 19.67 97.15 24.93" fill="${safeColor}"/><polygon points="97.15 7.92 99.7 13.18 97.15 15.73 94.6 13.18 97.15 7.92" fill="${safeColor}"/><polygon points="90 9.28 93.46 10.48 93.46 12.74 91.2 12.74 90 9.28" fill="${safeColor}"/><polygon points="104.02 23.3 100.56 22.1 100.56 19.84 102.82 19.84 104.02 23.3" fill="${safeColor}"/><polygon points="90 23.3 91.2 19.84 93.46 19.84 93.46 22.1 90 23.3" fill="${safeColor}"/><polygon points="104.02 9.28 102.82 12.74 100.56 12.74 100.56 10.48 104.02 9.28" fill="${safeColor}"/><path d="M93.94,6.73c-.18-2.73-2.3-5.03-4.83-5.4-2.49-.46-5.19,1.04-6.03,3.34-.43,1.17-.51,2.58-.75,3.99-.14.71-.27,1.43-.57,2.16-.29.72-.78,1.43-1.49,1.9-.72.45-1.54.59-2.3.6-.78.03-1.57-.19-2.24-.58-1.34-.8-2.16-2.33-2.05-3.82h.42c.1,1.33.9,2.52,2.04,3.05.57.25,1.18.4,1.8.34.64-.04,1.23-.21,1.69-.53.89-.69,1.21-2,1.4-3.33.19-1.35.26-2.77.76-4.25,1.11-3.02,4.53-4.75,7.55-4.04,1.5.34,2.85,1.21,3.77,2.4.89,1.21,1.35,2.71,1.25,4.16h-.42Z" fill="${safeColor}"/><path d="M182.45,16.92l-72.79,1.2c-.94.02-1.72-.73-1.73-1.68-.02-.94.73-1.72,1.68-1.73.02,0,.04,0,.06,0l72.79,1.2c.28,0,.5.23.49.51,0,.27-.22.49-.49.49Z" fill="${safeColor}"/><polygon points="194 16.42 184.28 11.71 179.57 16.42 184.28 21.14 194 16.42" fill="${safeColor}"/><path d="M99.64,6.73c-.11-1.45.35-2.95,1.25-4.16.92-1.19,2.27-2.06,3.77-2.4,3.02-.72,6.45,1.02,7.55,4.04.5,1.48.56,2.9.76,4.25.19,1.33.51,2.64,1.4,3.33.46.32,1.05.48,1.69.53.62.07,1.23-.08,1.8-.34,1.14-.53,1.95-1.72,2.04-3.05h.42c.11,1.48-.71,3.02-2.05,3.82-.67.39-1.47.61-2.24.58-.76,0-1.57-.15-2.3-.6-.71-.47-1.19-1.18-1.49-1.9-.3-.72-.43-1.45-.57-2.16-.25-1.41-.33-2.81-.75-3.99-.84-2.3-3.55-3.8-6.03-3.34-2.52.37-4.65,2.67-4.83,5.4h-.42Z" fill="${safeColor}"/></g></svg>`
      break
      
    case 'byzantine':
      // Byzantine Diamond (divider-4)
      svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 194 19.83"><g><path d="M11.55,9.34l72.79-1.2c.94-.02,1.72.73,1.73,1.68.02.94-.73,1.72-1.68,1.73-.02,0-.04,0-.06,0l-72.79-1.2c-.28,0-.5-.23-.49-.51,0-.27.22-.49.49-.49Z" fill="${safeColor}"/><polygon points="0 9.84 9.72 5.13 14.43 9.84 9.72 14.56 0 9.84" fill="${safeColor}"/><polygon points="8.81 9.84 18.52 5.13 23.24 9.84 18.52 14.56 8.81 9.84" fill="${safeColor}"/><polygon points="18.43 9.84 28.15 5.13 32.86 9.84 28.15 14.56 18.43 9.84" fill="${safeColor}"/><polygon points="89.87 2.9 93.33 4.1 93.33 6.36 91.07 6.36 89.87 2.9" fill="${safeColor}"/><polygon points="103.89 16.93 100.43 15.73 100.43 13.47 102.69 13.47 103.89 16.93" fill="${safeColor}"/><polygon points="89.87 16.93 91.07 13.47 93.33 13.47 93.33 15.73 89.87 16.93" fill="${safeColor}"/><polygon points="103.89 2.9 102.69 6.36 100.43 6.36 100.43 4.1 103.89 2.9" fill="${safeColor}"/><polygon points="86.97 9.91 90.26 8.32 91.86 9.91 90.26 11.51 86.97 9.91" fill="${safeColor}"/><polygon points="106.8 9.91 103.5 11.51 101.9 9.91 103.5 8.32 106.8 9.91" fill="${safeColor}"/><polygon points="96.88 19.83 95.28 16.53 96.88 14.94 98.48 16.53 96.88 19.83" fill="${safeColor}"/><polygon points="96.88 0 98.48 3.29 96.88 4.89 95.28 3.29 96.88 0" fill="${safeColor}"/><rect x="94.66" y="7.7" width="4.44" height="4.44" transform="translate(35.39 -65.6) rotate(45)" fill="${safeColor}"/><path d="M182.45,10.34l-72.79,1.2c-.94.02-1.72-.73-1.73-1.68-.02-.94.73-1.72,1.68-1.73.02,0,.04,0,.06,0l72.79,1.2c.28,0,.5.23.49.51,0,.27-.22.49-.49.49Z" fill="${safeColor}"/><polygon points="194 9.84 184.28 14.56 179.57 9.84 184.28 5.13 194 9.84" fill="${safeColor}"/><polygon points="185.19 9.84 175.47 14.56 170.76 9.84 175.47 5.13 185.19 9.84" fill="${safeColor}"/><polygon points="175.57 9.84 165.85 14.56 161.13 9.84 165.85 5.13 175.57 9.84" fill="${safeColor}"/></g></svg>`
      break
      
    default:
      return ''
  }
  
  return `data:image/svg+xml,${svg}`
}

// ============================================================================
// CORNER ORNAMENT STYLES
// ============================================================================

export type CornerStyle = 'none' | 'ornate-1' | 'ornate-2' | 'ornate-3' | 'ornate-4'

export const CORNER_STYLES: { value: CornerStyle; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'ornate-1', label: 'Byzantine Flourish' },
  { value: 'ornate-2', label: 'Corner Frame' },
  { value: 'ornate-3', label: 'Minimal Corner' },
  { value: 'ornate-4', label: 'Classic Scroll' },
]

/**
 * Get corner ornament URL
 * The SVGs are positioned for top-right corner and need CSS transforms for other corners
 */
export function getCornerSvgUrl(style: CornerStyle): string {
  switch (style) {
    case 'ornate-1':
      return '/corner-1.svg'
    case 'ornate-2':
      return '/corner-2.svg'
    case 'ornate-3':
      return '/corner-3.svg'
    case 'ornate-4':
      return '/corner-4.svg'
    default:
      return ''
  }
}

/**
 * Get CSS transform for positioning corner in different positions
 * Original SVGs are designed for top-left corner (ornament pointing inward from top-left)
 */
export function getCornerTransform(position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'): string {
  switch (position) {
    case 'top-left':
      return 'none'  // Original orientation
    case 'top-right':
      return 'scaleX(-1)'  // Flip horizontally
    case 'bottom-left':
      return 'scaleY(-1)'  // Flip vertically
    case 'bottom-right':
      return 'scale(-1, -1)'  // Flip both (rotate 180°)
    default:
      return 'none'
  }
}

// ============================================================================
// BACKGROUND PATTERN STYLES
// ============================================================================

export type PatternStyle = 'none' | 'damask'

export const PATTERN_STYLES: { value: PatternStyle; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'damask', label: 'Damask Pattern' },
]

/**
 * Get background pattern URL
 */
export function getPatternSvgUrl(style: PatternStyle): string {
  switch (style) {
    case 'damask':
      return '/demask-pattern.svg'
    default:
      return ''
  }
}
