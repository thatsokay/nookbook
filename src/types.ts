import fishData from '../assets/fish.json'
import bugData from '../assets/bugs.json'

export type Fish = typeof fishData[number]
export type Bug = typeof bugData[number]
// Common properties between Fish and Bug
// https://stackoverflow.com/a/47375979
export type Critter = {
  [K in keyof Fish & keyof Bug]: Fish[K] extends Bug[K] ? Fish[K] : never
}
