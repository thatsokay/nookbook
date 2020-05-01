import {useState, useMemo, useCallback} from 'react'

import {useLocalStorage} from './utilities'
import {Critter, Fish, Bug} from './types'

const moduloBetween = (
  {start, end}: {start: number; end: number},
  between: number,
) =>
  /* Given cyclic `start` and `end` boundaries, returns true if `between` is
   * between them and false otherwise.
   */
  start < end
    ? between >= start && between < end
    : between >= start || between < end

export const useHemisphere = <T extends Critter>(critters: T[]) => {
  const [storedHemisphere, setStoredHemisphere] = useLocalStorage(
    'hemisphere',
    'north',
  )
  const hemisphere = useMemo(
    () => (storedHemisphere === 'south' ? 'south' : 'north'),
    [storedHemisphere],
  )
  const setHemisphere = useCallback(
    (value: typeof hemisphere) => setStoredHemisphere(value),
    [setStoredHemisphere],
  )
  const hemisphereCritters = useMemo(
    () =>
      hemisphere === 'north'
        ? critters
        : critters.map((critter) => ({
            ...critter,
            active: {
              ...critter.active,
              months: critter.active.months.map((months) => ({
                start: (months.start + 6) % 12,
                end: (months.end + 6) % 12,
              })),
            },
          })),
    [critters, hemisphere],
  )
  return [
    hemisphereCritters,
    {
      hemisphere,
      setHemisphere,
    },
  ] as const
}

export const useActiveTimeFilter = <T extends Critter>(critters: T[]) => {
  const [activeTimeFilter, setActiveTimeFilter] = useState<
    'any' | 'now' | 'month'
  >('any')
  const now = new Date()
  const month = now.getMonth()
  const hour = now.getHours()
  const activeTimeFilteredCritters = useMemo(() => {
    switch (activeTimeFilter) {
      case 'any':
        return critters
      case 'now':
        return critters.filter(
          (critter) =>
            critter.active.months.some((bounds) =>
              moduloBetween(bounds, month),
            ) &&
            critter.active.hours.some((bounds) => moduloBetween(bounds, hour)),
        )
      case 'month':
        return critters.filter((critter) =>
          critter.active.months.some((bounds) => moduloBetween(bounds, month)),
        )
    }
  }, [critters, activeTimeFilter, month, hour])
  return [
    activeTimeFilteredCritters,
    {
      activeTimeFilter,
      setActiveTimeFilter,
    },
  ] as const
}

export const useFishLocationFilter = (fishData: Fish[]) => {
  const [locationFilter, setLocationFilter] = useState<
    'all' | 'river' | 'pond' | 'sea' | 'pier'
  >('all')
  const locationFilteredFish = useMemo(() => {
    switch (locationFilter) {
      case 'all':
        return fishData
      default:
        return fishData.filter((fish) =>
          fish.location.toLowerCase().startsWith(locationFilter),
        )
    }
  }, [fishData, locationFilter])
  return [
    locationFilteredFish,
    {
      locationFilter,
      setLocationFilter,
    },
  ] as const
}

export const useFishSort = (fishData: Fish[]) => {
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'price' | 'size'>(
    'default',
  )
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const sortedFish = useMemo(() => {
    switch (sortBy) {
      case 'default':
        return sortDirection === 'asc' ? fishData : [...fishData].reverse()
      case 'name':
        return sortDirection === 'asc'
          ? [...fishData].sort((a, b) => a.name.localeCompare(b.name))
          : [...fishData].sort((a, b) => b.name.localeCompare(a.name))
      case 'price':
        return sortDirection === 'asc'
          ? [...fishData].sort((a, b) => a.price - b.price)
          : [...fishData].sort((a, b) => b.price - a.price)
      case 'size':
        return sortDirection === 'asc'
          ? [...fishData].sort((a, b) => a.shadow.size - b.shadow.size)
          : [...fishData].sort((a, b) => b.shadow.size - a.shadow.size)
    }
  }, [fishData, sortBy, sortDirection])
  return [
    sortedFish,
    {
      sortBy,
      setSortBy,
      sortDirection,
      setSortDirection,
    },
  ] as const
}

export const useBugLocationFilter = (bugData: Bug[]) => {
  const [locationFilter, setLocationFilter] = useState<
    'all' | 'tree' | 'flower' | 'other'
  >('all')
  const locationFilteredBugs = useMemo(() => {
    switch (locationFilter) {
      case 'all':
        return bugData
      case 'other':
        return bugData.filter(
          (bug) =>
            !['tree', 'flower'].some((location) =>
              bug.location.toLowerCase().includes(location),
            ),
        )
      default:
        return bugData.filter((bug) =>
          bug.location.toLowerCase().includes(locationFilter),
        )
    }
  }, [bugData, locationFilter])
  return [
    locationFilteredBugs,
    {
      locationFilter,
      setLocationFilter,
    },
  ] as const
}

export const useBugSort = (bugData: Bug[]) => {
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'price'>('default')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const sortedBugs = useMemo(() => {
    switch (sortBy) {
      case 'default':
        return sortDirection === 'asc' ? bugData : [...bugData].reverse()
      case 'name':
        return sortDirection === 'asc'
          ? [...bugData].sort((a, b) => a.name.localeCompare(b.name))
          : [...bugData].sort((a, b) => b.name.localeCompare(a.name))
      case 'price':
        return sortDirection === 'asc'
          ? [...bugData].sort((a, b) => a.price - b.price)
          : [...bugData].sort((a, b) => b.price - a.price)
    }
  }, [bugData, sortBy, sortDirection])
  return [
    sortedBugs,
    {
      sortBy,
      setSortBy,
      sortDirection,
      setSortDirection,
    },
  ] as const
}
