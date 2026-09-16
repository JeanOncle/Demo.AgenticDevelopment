import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'
import { formations, getFormation, type FormationId } from '../src/domain/formation'

describe('App', () => {
  it('shows selection counts, surfaces rule errors, and blocks confirmation until complete', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('0/11')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bevestig opstelling' })).toBeDisabled()

    for (let index = 0; index < 11; index += 1) {
      await user.click(screen.getAllByRole('button', { name: 'Basis' })[0])
    }

    expect(screen.getByText('11/11')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bevestig opstelling' })).toBeEnabled()

    await user.click(screen.getAllByRole('button', { name: 'Basis' })[0])
    expect(screen.getByRole('alert')).toHaveTextContent('basisopstelling bevat al 11 spelers')
  })

  it('changes formation and places a selected starter through the accessible alternative', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: 'Basis' })[0])
    await user.click(screen.getByRole('button', { name: /Niek/ }))
    await user.click(screen.getByRole('button', { name: /Doelman: vrij/ }))

    expect(screen.getByRole('button', { name: /Doelman: Niek/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '4-3-3' }))
    expect(screen.getByRole('alert')).toHaveTextContent('formatie is gewijzigd')
    expect(screen.getByText('1 nog niet geplaatst')).toBeInTheDocument()
  })

  it('only offers the captain button to starters, moves the marking to a newly chosen captain, and clears it on removal', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await user.click(screen.getAllByRole('button', { name: 'Basis' })[0])
    await user.click(screen.getAllByRole('button', { name: 'Reserve' })[0])

    expect(screen.getAllByRole('button', { name: 'Aanvoerder' })).toHaveLength(1)

    await user.click(screen.getAllByRole('button', { name: 'Aanvoerder' })[0])
    expect(screen.getAllByRole('button', { name: 'Aanvoerder' })[0]).toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelectorAll('.captain').length).toBeGreaterThan(0)

    await user.click(screen.getAllByRole('button', { name: 'Basis' })[0])
    await user.click(screen.getAllByRole('button', { name: 'Aanvoerder' })[1])

    const captainButtons = screen.getAllByRole('button', { name: 'Aanvoerder' })
    expect(captainButtons.filter((button) => button.getAttribute('aria-pressed') === 'true')).toHaveLength(1)
    expect(captainButtons[0]).toHaveAttribute('aria-pressed', 'false')
    expect(captainButtons[1]).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getAllByRole('button', { name: 'Verwijder' })[2])
    expect(
      screen
        .getAllByRole('button', { name: 'Aanvoerder' })
        .filter((button) => button.getAttribute('aria-pressed') === 'true'),
    ).toHaveLength(0)
  })

  it.each(formations.map((formation) => formation.id))(
    'aligns every position line in the %s formation with the exact number of positions in that line',
    async (formationId: FormationId) => {
      const user = userEvent.setup()
      const { container } = render(<App />)

      await user.click(screen.getAllByRole('button', { name: 'Basis' })[0])
      await user.click(screen.getByRole('button', { name: formationId }))

      const formation = getFormation(formationId)
      const groups = ['goalkeeper', 'defence', 'midfield', 'attack'] as const

      for (const group of groups) {
        const expectedCount = formation.positions.filter((position) => position.group === group).length
        const row = container.querySelector(`.position-row.${group}`)
        expect(row).not.toBeNull()
        expect(row?.querySelectorAll('.position-slot')).toHaveLength(expectedCount)
        expect((row as HTMLElement).style.getPropertyValue('--players-in-row')).toBe(String(expectedCount))
      }
    },
  )
})
