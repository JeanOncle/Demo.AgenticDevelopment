import type { Player } from '../domain/selection'

export const players: Player[] = [
  'Milan de Boer',
  'Noah Jansen',
  'Sem Visser',
  'Liam Smit',
  'Daan Bakker',
  'Lucas Meijer',
  'Finn de Jong',
  'Bram Mulder',
  'Mees Vos',
  'Timo van Dijk',
  'Jesse Bos',
  'Noud Peters',
  'Lars van Leeuwen',
  'Ruben Dekker',
  'Stijn Willems',
  'Mats Kuiper',
  'Cas Vermeer',
  'Olivier van den Berg',
].map((name, index) => ({ id: `speler-${index + 1}`, name }))
