import { describe, expect, it } from 'vitest'
import { formations, getFormation, getUnplacedStarterIds, placePlayer, removePlayerPlacements } from '../src/domain/formation'
import type { Selection } from '../src/domain/selection'

const selection: Selection = {
  starters: ['player-1', 'player-2'],
  substitutes: ['player-3'],
}

describe('formation domain rules', () => {
  it('defines eleven positions for every supported formation', () => {
    expect(formations.map((formation) => formation.id)).toEqual(['4-4-2', '4-3-3', '3-5-2'])
    expect(formations.every((formation) => formation.positions.length === 11)).toBe(true)
  })

  it('places a starter once and moves the player to another empty position', () => {
    const formation = getFormation('4-4-2')
    const firstPosition = formation.positions[0].id
    const secondPosition = formation.positions[1].id
    const firstPlacement = placePlayer(selection, formation, {}, 'player-1', firstPosition).placements

    expect(placePlayer(selection, formation, firstPlacement, 'player-1', secondPosition).placements).toEqual({
      [secondPosition]: 'player-1',
    })
  })

  it('rejects an occupied slot and players outside the starting lineup', () => {
    const formation = getFormation('4-4-2')
    const positionId = formation.positions[0].id
    const placements = { [positionId]: 'player-1' }

    expect(placePlayer(selection, formation, placements, 'player-2', positionId).error).toMatch(/bezet/)
    expect(placePlayer(selection, formation, {}, 'player-3', positionId).error).toMatch(/Alleen basisspelers/)
  })

  it('removes placements for deselected players and derives unplaced starters', () => {
    const formation = getFormation('4-4-2')
    const placements = { [formation.positions[0].id]: 'player-1' }

    expect(removePlayerPlacements(placements, 'player-1')).toEqual({})
    expect(getUnplacedStarterIds(selection, placements)).toEqual(['player-2'])
  })
})
