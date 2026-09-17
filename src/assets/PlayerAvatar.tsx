/**
 * Shared, decorative avatar shown for every placed starter on the pitch.
 *
 * Deliberately generic and identical for all players (see DEMO-11): this is a
 * presentation-only detail, not player-specific data, so it lives outside
 * `src/domain` and `src/data/players.ts`. The `Player` type stays unchanged.
 */
export function PlayerAvatar() {
  return (
    <svg
      className="position-slot-avatar"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 20.5c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="currentColor" />
    </svg>
  )
}
