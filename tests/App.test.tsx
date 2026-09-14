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
})
