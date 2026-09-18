/**
 * Decorative icon for the player currently carrying "de gesp" (see DEMO-14).
 * Shown on the occupied pitch position of the gesp holder, next to the
 * shared `PlayerAvatar`. Purely presentational (`aria-hidden`), so it lives
 * outside `src/domain` just like `PlayerAvatar`. The glinstereffect itself is
 * applied via the `gesp-icon` CSS class (see styles.css).
 */
export function GespIcon() {
  return (
    <svg
      className="gesp-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="9" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="15" y="9" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="9" y="10.5" width="6" height="3" rx="0.75" fill="currentColor" />
    </svg>
  )
}
