import type { Player, Selection } from './selection'

export type GespResult = { gespHolderId?: string; error?: string }

/**
 * Only players whose first name is exactly 3 letters long are eligible to
 * carry "de gesp" (see DEMO-14). This is a pure name-length check, derived
 * directly from `Player`, so no change to `Player` or `players.ts` is needed.
 */
export const isGespEligible = (player: Player): boolean => player.name.length === 3

export const setGespHolder = (
  selection: Selection,
  playerId: string,
  players: Player[],
): GespResult => {
  if (!selection.starters.includes(playerId)) {
    return { error: 'Alleen basisspelers kunnen de gesp toegewezen krijgen.' }
  }

  const player = players.find((candidate) => candidate.id === playerId)
  if (!player || !isGespEligible(player)) {
    return { error: 'Alleen spelers met een voornaam van 3 letters kunnen de gesp toegewezen krijgen.' }
  }

  return { gespHolderId: playerId }
}

export const clearGespHolderIfRemoved = (
  gespHolderId: string | undefined,
  playerId: string,
): string | undefined => (gespHolderId === playerId ? undefined : gespHolderId)
