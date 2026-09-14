export type Player = {
  id: string
  name: string
}

export type Selection = {
  starters: string[]
  substitutes: string[]
}

export type SelectionResult =
  | { selection: Selection; error?: never }
  | { selection: Selection; error: string }

export const MAX_STARTERS = 11
export const MAX_SUBSTITUTES = 7

export const emptySelection = (): Selection => ({ starters: [], substitutes: [] })

export const addStarter = (selection: Selection, playerId: string): SelectionResult =>
  addPlayer(selection, playerId, 'starters', MAX_STARTERS, 'De basisopstelling bevat al 11 spelers.')

export const addSubstitute = (selection: Selection, playerId: string): SelectionResult =>
  addPlayer(selection, playerId, 'substitutes', MAX_SUBSTITUTES, 'De reserves bevatten al 7 spelers.')

export const removePlayer = (selection: Selection, playerId: string): Selection => ({
  starters: selection.starters.filter((id) => id !== playerId),
  substitutes: selection.substitutes.filter((id) => id !== playerId),
})

export const isValidSelection = (selection: Selection): boolean =>
  selection.starters.length === MAX_STARTERS &&
  selection.substitutes.length <= MAX_SUBSTITUTES &&
  new Set([...selection.starters, ...selection.substitutes]).size ===
    selection.starters.length + selection.substitutes.length

const addPlayer = (
  selection: Selection,
  playerId: string,
  target: keyof Selection,
  limit: number,
  limitMessage: string,
): SelectionResult => {
  if (selection.starters.includes(playerId) || selection.substitutes.includes(playerId)) {
    return {
      selection,
      error: 'Deze speler is al geselecteerd. Verwijder de speler eerst uit de huidige selectie.',
    }
  }

  if (selection[target].length >= limit) {
    return { selection, error: limitMessage }
  }

  return {
    selection: {
      ...selection,
      [target]: [...selection[target], playerId],
    },
  }
}
