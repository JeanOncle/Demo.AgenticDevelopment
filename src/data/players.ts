import type { Player } from '../domain/selection'

export const players: Player[] = [
  'Niek',
  'Thomas',
  'Dennis',
  'Eric',
  'Jan',
  'Jasper',
  'Jeroen',
  'Klaas',
  'Koen',
  'Maarten',
  'Niels',
  'Paul',
  'Rik',
  'Robbert',
  'Roel',
  'Rudy',
  'Sander',
  'Sjors',
].map((name, index) => ({ id: `speler-${index + 1}`, name }))
