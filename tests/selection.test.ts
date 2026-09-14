import { describe, expect, it } from 'vitest'
import {
  addStarter,
  addSubstitute,
  emptySelection,
  isValidSelection,
  MAX_STARTERS,
  MAX_SUBSTITUTES,
  removePlayer,
} from '../src/domain/selection'

describe('selection domain rules', () => {
  it('is valid only with exactly eleven starters', () => {
    let selection = emptySelection()
    for (let index = 0; index < MAX_STARTERS; index += 1) {
      selection = addStarter(selection, `player-${index}`).selection
    }

    expect(isValidSelection(selection)).toBe(true)
    expect(isValidSelection(removePlayer(selection, 'player-1'))).toBe(false)
  })

  it('rejects a twelfth starter and an eighth substitute', () => {
    let selection = emptySelection()
    for (let index = 0; index < MAX_STARTERS; index += 1) {
      selection = addStarter(selection, `starter-${index}`).selection
    }
    expect(addStarter(selection, 'starter-extra').error).toMatch(/al 11/)

    selection = emptySelection()
    for (let index = 0; index < MAX_SUBSTITUTES; index += 1) {
      selection = addSubstitute(selection, `substitute-${index}`).selection
    }
    expect(addSubstitute(selection, 'substitute-extra').error).toMatch(/al 7/)
  })

  it('prevents a player from being selected twice and supports deselecting', () => {
    const selected = addStarter(emptySelection(), 'player-1').selection
    expect(addSubstitute(selected, 'player-1').error).toMatch(/al geselecteerd/)
    expect(removePlayer(selected, 'player-1')).toEqual(emptySelection())
  })
})
