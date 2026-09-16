import type { Selection } from './selection'

export type CaptainResult = { captainId?: string; error?: string }

export const setCaptain = (selection: Selection, playerId: string): CaptainResult => {
  if (!selection.starters.includes(playerId)) {
    return { error: 'Alleen basisspelers kunnen als aanvoerder worden aangewezen.' }
  }

  return { captainId: playerId }
}

export const clearCaptainIfRemoved = (
  captainId: string | undefined,
  playerId: string,
): string | undefined => (captainId === playerId ? undefined : captainId)
