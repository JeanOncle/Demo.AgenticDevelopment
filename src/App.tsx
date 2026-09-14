import { useMemo, useState } from 'react'
import { players } from './data/players'
import {
  addStarter,
  addSubstitute,
  emptySelection,
  isValidSelection,
  MAX_STARTERS,
  MAX_SUBSTITUTES,
  removePlayer,
  type Selection,
  type SelectionResult,
} from './domain/selection'

export default function App() {
  const [selection, setSelection] = useState<Selection>(emptySelection)
  const [message, setMessage] = useState<string>()
  const isValid = isValidSelection(selection)
  const selectedCount = selection.starters.length + selection.substitutes.length

  const playerStatuses = useMemo(
    () =>
      new Map<string, 'Basis' | 'Reserve'>([
        ...selection.starters.map((id): [string, 'Basis'] => [id, 'Basis']),
        ...selection.substitutes.map((id): [string, 'Reserve'] => [id, 'Reserve']),
      ]),
    [selection],
  )

  const applySelection = (result: SelectionResult): void => {
    setSelection(result.selection)
    setMessage(result.error)
  }

  const remove = (playerId: string): void => {
    setSelection((current) => removePlayer(current, playerId))
    setMessage(undefined)
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Komende wedstrijd</p>
        <h1>Maak de opstelling</h1>
        <p>Wijs maximaal 11 basisspelers en 7 reserves aan. Niet-geselecteerde spelers blijven beschikbaar.</p>
      </header>

      <section className="selection-summary" aria-label="Selectiestatus">
        <div>
          <span>Basisopstelling</span>
          <strong>{selection.starters.length}/{MAX_STARTERS}</strong>
        </div>
        <div>
          <span>Reserves</span>
          <strong>{selection.substitutes.length}/{MAX_SUBSTITUTES}</strong>
        </div>
        <div>
          <span>Totaal geselecteerd</span>
          <strong>{selectedCount}</strong>
        </div>
      </section>

      {message && (
        <p className="message" role="alert">
          {message}
        </p>
      )}

      <section aria-labelledby="players-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Beschikbare selectie</p>
            <h2 id="players-heading">Spelers</h2>
          </div>
          <p>{players.length} spelers beschikbaar</p>
        </div>

        <ul className="player-list">
          {players.map((player) => {
            const status = playerStatuses.get(player.id)
            return (
              <li className="player-row" key={player.id}>
                <div>
                  <strong>{player.name}</strong>
                  <span aria-live="polite">{status ?? 'Niet geselecteerd'}</span>
                </div>
                <div className="player-actions" aria-label={`Acties voor ${player.name}`}>
                  {!status ? (
                    <>
                      <button type="button" onClick={() => applySelection(addStarter(selection, player.id))}>
                        Basis
                      </button>
                      <button type="button" className="secondary" onClick={() => applySelection(addSubstitute(selection, player.id))}>
                        Reserve
                      </button>
                    </>
                  ) : (
                    <button type="button" className="remove" onClick={() => remove(player.id)}>
                      Verwijder
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="confirmation" aria-labelledby="confirmation-heading">
        <h2 id="confirmation-heading">Opstelling bevestigen</h2>
        <p>
          {isValid
            ? 'De basisopstelling is compleet en kan worden bevestigd.'
            : `Selecteer nog ${MAX_STARTERS - selection.starters.length} basisspeler${MAX_STARTERS - selection.starters.length === 1 ? '' : 's'} om te bevestigen.`}
        </p>
        <button type="button" disabled={!isValid} aria-describedby="confirmation-help">
          Bevestig opstelling
        </button>
        <p id="confirmation-help" className="sr-only">
          Bevestigen is alleen mogelijk met precies 11 basisspelers.
        </p>
      </section>
    </main>
  )
}
