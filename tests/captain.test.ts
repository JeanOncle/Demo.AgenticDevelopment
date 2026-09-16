import { describe, expect, it } from 'vitest'
import { clearCaptainIfRemoved, setCaptain } from '../src/domain/captain'
import type { Selection } from '../src/domain/selection'

const selection: Selection = {
  starters: ['player-1', 'player-2'],
  substitutes: ['player-3'],
}

describe('captain domain rules', () => {
  it('assigns a starter as captain', () => {
    expect(setCaptain(selection, 'player-1')).toEqual({ captainId: 'player-1' })
  })

  it('refuses a substitute as captain without changing state', () => {
    expect(setCaptain(selection, 'player-3').error).toMatch(/Alleen basisspelers/)
  })

  it('automatically replaces the previous captain when a new one is assigned', () => {
    const first = setCaptain(selection, 'player-1')
    const second = setCaptain(selection, 'player-2')

    expect(first.captainId).toBe('player-1')
    expect(second.captainId).toBe('player-2')
  })

  it('clears the captain only when the removed player was the captain', () => {
    expect(clearCaptainIfRemoved('player-1', 'player-1')).toBeUndefined()
    expect(clearCaptainIfRemoved('player-1', 'player-2')).toBe('player-1')
    expect(clearCaptainIfRemoved(undefined, 'player-1')).toBeUndefined()
  })
})
