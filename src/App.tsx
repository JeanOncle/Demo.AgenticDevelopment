import { useMemo, useState, type CSSProperties, type DragEvent } from 'react'
import { GespIcon } from './assets/GespIcon'
import { PlayerAvatar } from './assets/PlayerAvatar'
import { players } from './data/players'
import { clearCaptainIfRemoved, setCaptain } from './domain/captain'
import { clearGespHolderIfRemoved, isGespEligible, setGespHolder } from './domain/gesp'
import {
  formations,
  getFormation,
  getUnplacedStarterIds,
  placePlayer,
  removePlayerPlacements,
  type FormationId,
  type Placements,
} from './domain/formation'
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
  const [formationId, setFormationId] = useState<FormationId>('4-4-2')
  const [placements, setPlacements] = useState<Placements>({})
  const [selectedStarterId, setSelectedStarterId] = useState<string>()
  const [captainId, setCaptainId] = useState<string>()
  const [gespHolderId, setGespHolderId] = useState<string>()
  const isValid = isValidSelection(selection)
  const selectedCount = selection.starters.length + selection.substitutes.length
  const formation = getFormation(formationId)

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
    setPlacements((current) => removePlayerPlacements(current, playerId))
    setCaptainId((current) => clearCaptainIfRemoved(current, playerId))
    setGespHolderId((current) => clearGespHolderIfRemoved(current, playerId))
    if (selectedStarterId === playerId) {
      setSelectedStarterId(undefined)
    }
    setMessage(undefined)
  }

  const assignCaptain = (playerId: string): void => {
    const result = setCaptain(selection, playerId)
    setMessage(result.error)
    if (!result.error) {
      setCaptainId(result.captainId)
    }
  }

  const assignGesp = (playerId: string): void => {
    const result = setGespHolder(selection, playerId, players)
    setMessage(result.error)
    if (!result.error) {
      setGespHolderId(result.gespHolderId)
    }
  }

  const placeStarter = (playerId: string, positionId: string): void => {
    const result = placePlayer(selection, formation, placements, playerId, positionId)
    setPlacements(result.placements)
    setMessage(result.error)
    if (!result.error) {
      setSelectedStarterId(undefined)
    }
  }

  const handleDrop = (event: DragEvent<HTMLButtonElement>, positionId: string): void => {
    event.preventDefault()
    const playerId = event.dataTransfer.getData('text/plain')
    if (playerId) {
      placeStarter(playerId, positionId)
    }
  }

  const changeFormation = (nextFormationId: FormationId): void => {
    setFormationId(nextFormationId)
    setPlacements({})
    setSelectedStarterId(undefined)
    setMessage('De formatie is gewijzigd. Plaats de basisspelers opnieuw op het veld.')
  }

  const starters = selection.starters
    .map((playerId) => players.find((player) => player.id === playerId))
    .filter((player): player is (typeof players)[number] => Boolean(player))
  const unplacedStarters = getUnplacedStarterIds(selection, placements)

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
            const isCaptain = player.id === captainId
            const isGesp = player.id === gespHolderId
            const nameClassName = [isCaptain ? 'captain' : '', isGesp ? 'gesp' : ''].filter(Boolean).join(' ')
            return (
              <li className="player-row" key={player.id}>
                <div>
                  <strong className={nameClassName || undefined}>
                    {player.name} {isCaptain ? '(Aanvoerder)' : ''} {isGesp ? '(Gesp)' : ''}
                  </strong>
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
                    <>
                      {status === 'Basis' && (
                        <button
                          type="button"
                          className={isCaptain ? 'captain-toggle active' : 'captain-toggle'}
                          aria-pressed={isCaptain}
                          onClick={() => assignCaptain(player.id)}
                        >
                          Aanvoerder
                        </button>
                      )}
                      {status === 'Basis' && isGespEligible(player) && (
                        <button
                          type="button"
                          className={player.id === gespHolderId ? 'gesp-toggle active' : 'gesp-toggle'}
                          aria-pressed={player.id === gespHolderId}
                          onClick={() => assignGesp(player.id)}
                        >
                          Gesp
                        </button>
                      )}
                      <button type="button" className="remove" onClick={() => remove(player.id)}>
                        Verwijder
                      </button>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="formation-section" aria-labelledby="formation-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Tactiek</p>
            <h2 id="formation-heading">Plaats de basisspelers</h2>
          </div>
          <p>{unplacedStarters.length} nog niet geplaatst</p>
        </div>

        <div className="formation-picker" aria-label="Kies een formatie">
          {formations.map((candidate) => (
            <button
              type="button"
              className={candidate.id === formationId ? 'formation-choice active' : 'formation-choice'}
              aria-pressed={candidate.id === formationId}
              key={candidate.id}
              onClick={() => changeFormation(candidate.id)}
            >
              {candidate.label}
            </button>
          ))}
        </div>

        {starters.length === 0 ? (
          <p className="empty-state">Selecteer eerst basisspelers om ze op het veld te plaatsen.</p>
        ) : (
          <div className="pitch-layout">
            <div className="starter-bank" aria-label="Basisspelers voor plaatsing">
              <h3>Basisspelers</h3>
              <p>Kies een speler en daarna een veldpositie, of sleep de speler naar het veld.</p>
              <ul>
                {starters.map((player) => {
                  const isSelected = player.id === selectedStarterId
                  const isPlaced = !unplacedStarters.includes(player.id)
                  const isCaptain = player.id === captainId
                  const isGesp = player.id === gespHolderId
                  const className = [
                    'starter-chip',
                    isSelected ? 'selected' : '',
                    isCaptain ? 'captain' : '',
                    isGesp ? 'gesp' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')
                  return (
                    <li key={player.id}>
                      <button
                        type="button"
                        className={className}
                        aria-pressed={isSelected}
                        draggable
                        onClick={() => setSelectedStarterId(isSelected ? undefined : player.id)}
                        onDragStart={(event) => event.dataTransfer.setData('text/plain', player.id)}
                      >
                        {player.name} {isPlaced ? '(geplaatst)' : ''} {isCaptain ? '(Aanvoerder)' : ''} {isGesp ? '(Gesp)' : ''}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="pitch" aria-label={`Voetbalveld in formatie ${formation.label}`}>
              {(['attack', 'midfield', 'defence', 'goalkeeper'] as const).map((group) => {
                const groupPositions = formation.positions.filter((position) => position.group === group)
                return (
                  <div
                    className={`position-row ${group}`}
                    key={group}
                    style={{ '--players-in-row': groupPositions.length } as CSSProperties}
                  >
                    {groupPositions.map((position) => {
                      const player = players.find((candidate) => candidate.id === placements[position.id])
                      const isCaptain = player !== undefined && player.id === captainId
                      const isGesp = player !== undefined && player.id === gespHolderId
                      const className = [
                        'position-slot',
                        player ? 'occupied' : '',
                        isCaptain ? 'captain' : '',
                        isGesp ? 'gesp' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')
                      return (
                        <button
                          type="button"
                          className={className}
                          aria-label={`${position.label}${player ? `: ${player.name}${isCaptain ? ' (Aanvoerder)' : ''}${isGesp ? ' (Gesp)' : ''}` : ': vrij'}`}
                          key={position.id}
                          onClick={() => {
                            if (selectedStarterId) {
                              placeStarter(selectedStarterId, position.id)
                            } else {
                              setMessage('Kies eerst een basisspeler om deze positie te vullen.')
                            }
                          }}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => handleDrop(event, position.id)}
                        >
                          <span>{position.label}</span>
                          {player && <PlayerAvatar />}
                          {isGesp && <GespIcon />}
                          <strong>{player?.name ?? 'Vrij'}</strong>
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        )}
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
