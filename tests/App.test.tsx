import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../src/App'

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
    await user.click(screen.getByRole('button', { name: /Milan de Boer/ }))
    await user.click(screen.getByRole('button', { name: /Doelman: vrij/ }))

    expect(screen.getByRole('button', { name: /Doelman: Milan de Boer/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '4-3-3' }))
    expect(screen.getByRole('alert')).toHaveTextContent('formatie is gewijzigd')
    expect(screen.getByText('1 nog niet geplaatst')).toBeInTheDocument()
  })
})
