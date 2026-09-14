import type { Selection } from './selection'

export type FormationId = '4-4-2' | '4-3-3' | '3-5-2'
export type PositionGroup = 'goalkeeper' | 'defence' | 'midfield' | 'attack'

export type FieldPosition = {
  id: string
  label: string
  group: PositionGroup
}

export type Formation = {
  id: FormationId
  label: string
  positions: FieldPosition[]
}

export type Placements = Record<string, string>

export type PlacementResult =
  | { placements: Placements; error?: never }
  | { placements: Placements; error: string }

const positions = (formation: FormationId, group: PositionGroup, labels: string[]): FieldPosition[] =>
  labels.map((label, index) => ({
    id: `${formation}-${group}-${index + 1}`,
    label,
    group,
  }))

export const formations: Formation[] = [
  {
    id: '4-4-2',
    label: '4-4-2',
    positions: [
      ...positions('4-4-2', 'goalkeeper', ['Doelman']),
      ...positions('4-4-2', 'defence', ['Rechtsback', 'Centrale verdediger', 'Centrale verdediger', 'Linksback']),
      ...positions('4-4-2', 'midfield', ['Rechtermiddenvelder', 'Centrale middenvelder', 'Centrale middenvelder', 'Linkermiddenvelder']),
      ...positions('4-4-2', 'attack', ['Spits', 'Spits']),
    ],
  },
  {
    id: '4-3-3',
    label: '4-3-3',
    positions: [
      ...positions('4-3-3', 'goalkeeper', ['Doelman']),
      ...positions('4-3-3', 'defence', ['Rechtsback', 'Centrale verdediger', 'Centrale verdediger', 'Linksback']),
      ...positions('4-3-3', 'midfield', ['Rechtermiddenvelder', 'Centrale middenvelder', 'Linkermiddenvelder']),
      ...positions('4-3-3', 'attack', ['Rechtsbuiten', 'Spits', 'Linksbuiten']),
    ],
  },
  {
    id: '3-5-2',
    label: '3-5-2',
    positions: [
      ...positions('3-5-2', 'goalkeeper', ['Doelman']),
      ...positions('3-5-2', 'defence', ['Rechter centrale verdediger', 'Centrale verdediger', 'Linker centrale verdediger']),
      ...positions('3-5-2', 'midfield', ['Rechter wingback', 'Centrale middenvelder', 'Centrale middenvelder', 'Centrale middenvelder', 'Linker wingback']),
      ...positions('3-5-2', 'attack', ['Spits', 'Spits']),
    ],
  },
]

export const getFormation = (id: FormationId): Formation =>
  formations.find((formation) => formation.id === id) ?? formations[0]

export const placePlayer = (
  selection: Selection,
  formation: Formation,
  placements: Placements,
  playerId: string,
  positionId: string,
): PlacementResult => {
  if (!selection.starters.includes(playerId)) {
    return { placements, error: 'Alleen basisspelers kunnen op het veld worden geplaatst.' }
  }

  if (!formation.positions.some((position) => position.id === positionId)) {
    return { placements, error: 'Deze veldpositie hoort niet bij de gekozen formatie.' }
  }

  const occupyingPlayer = placements[positionId]
  if (occupyingPlayer && occupyingPlayer !== playerId) {
    return { placements, error: 'Deze veldpositie is al bezet.' }
  }

  const nextPlacements = Object.fromEntries(
    Object.entries(placements).filter(([, placedPlayerId]) => placedPlayerId !== playerId),
  )

  return { placements: { ...nextPlacements, [positionId]: playerId } }
}

export const removePlayerPlacements = (placements: Placements, playerId: string): Placements =>
  Object.fromEntries(Object.entries(placements).filter(([, placedPlayerId]) => placedPlayerId !== playerId))

export const getUnplacedStarterIds = (selection: Selection, placements: Placements): string[] => {
  const placedPlayerIds = new Set(Object.values(placements))
  return selection.starters.filter((playerId) => !placedPlayerIds.has(playerId))
}
