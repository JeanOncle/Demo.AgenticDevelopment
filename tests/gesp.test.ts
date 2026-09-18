import { describe, expect, it } from 'vitest'
import { clearGespHolderIfRemoved, isGespEligible, setGespHolder } from '../src/domain/gesp'
import type { Player, Selection } from '../src/domain/selection'

const players: Player[] = [
  { id: 'player-1', name: 'Jan' },
  { id: 'player-2', name: 'Rik' },
  { id: 'player-3', name: 'Niek' },
  { id: 'player-4', name: 'Eric' },
]

const selection: Selection = {
  starters: ['player-1', 'player-2', 'player-3'],
  substitutes: ['player-4'],
}

describe('gesp eligibility', () => {
  it('is eligible only for players whose first name is exactly 3 letters', () => {
    expect(isGespEligible(players[0])).toBe(true) // Jan
    expect(isGespEligible(players[1])).toBe(true) // Rik
    expect(isGespEligible(players[2])).toBe(false) // Niek
    expect(isGespEligible(players[3])).toBe(false) // Eric
  })
})

describe('gesp domain rules', () => {
  it('assigns an eligible starter as gesp holder', () => {
    expect(setGespHolder(selection, 'player-1', players)).toEqual({ gespHolderId: 'player-1' })
  })

  it('refuses a substitute as gesp holder, even if eligible by name length', () => {
    expect(setGespHolder(selection, 'player-4', players).error).toMatch(/basisspelers/)
  })

  it('refuses a starter whose first name is not exactly 3 letters', () => {
    expect(setGespHolder(selection, 'player-3', players).error).toMatch(/3 letters/)
  })

  it('automatically replaces the previous gesp holder when a new one is assigned', () => {
    const first = setGespHolder(selection, 'player-1', players)
    const second = setGespHolder(selection, 'player-2', players)

    expect(first.gespHolderId).toBe('player-1')
    expect(second.gespHolderId).toBe('player-2')
  })

  it('clears the gesp holder only when the removed player was the holder', () => {
    expect(clearGespHolderIfRemoved('player-1', 'player-1')).toBeUndefined()
    expect(clearGespHolderIfRemoved('player-1', 'player-2')).toBe('player-1')
    expect(clearGespHolderIfRemoved(undefined, 'player-1')).toBeUndefined()
  })
})
