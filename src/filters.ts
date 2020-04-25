import {useState, useMemo, useCallback} from 'react'

import {useLocalStorage} from './utilities'
import fishJson from '../assets/fish.json'

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

export const useHemisphere = (fishData: typeof fishJson) => {
  const [storedHemisphere, setStoredHemisphere] = useLocalStorage(
    'hemisphere',
    'north',
  )
  const hemisphere = useMemo(
    () => (storedHemisphere === 'south' ? 'south' : 'north'),
    [storedHemisphere],
  )
  const setHemisphere = useCallback(
    (value: 'north' | 'south') => setStoredHemisphere(value),
    [setStoredHemisphere],
  )
  const hemisphereFish = useMemo(
    () =>
      hemisphere === 'north'
        ? fishData
        : fishData.map((fish) => ({
            ...fish,
            active: {
              ...fish.active,
              months: fish.active.months.map((months) => ({
                start: (months.start + 6) % 12,
                end: (months.end + 6) % 12,
              })),
            },
          })),
    [fishData, hemisphere],
  )
  return {
    hemisphere,
    setHemisphere,
    hemisphereFish,
  }
}

export const useActiveTimeFilter = (fishData: typeof fishJson) => {
  const [activeTimeFilter, setActiveTimeFilter] = useState<
    'any' | 'now' | 'month'
  >('any')
  const now = new Date()
  const month = now.getMonth()
  const hour = now.getHours()
  const activeTimeFilteredFish = useMemo(() => {
    switch (activeTimeFilter) {
      case 'any':
        return fishData
      case 'now':
        return fishData.filter(
          (fish) =>
            fish.active.months.some((bounds) => moduloBetween(bounds, month)) &&
            fish.active.hours.some((bounds) => moduloBetween(bounds, hour)),
        )
      case 'month':
        return fishData.filter((fish) =>
          fish.active.months.some((bounds) => moduloBetween(bounds, month)),
        )
    }
  }, [fishData, activeTimeFilter, month, hour])
  return {
    activeTimeFilter,
    setActiveTimeFilter,
    activeTimeFilteredFish,
  }
}

export const useLocationFilter = (fishData: typeof fishJson) => {
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
  return {
    locationFilter,
    setLocationFilter,
    locationFilteredFish,
  }
}

export const useSort = (fishData: typeof fishJson) => {
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
          ? [...fishData].sort((a, b) => a.name.en.localeCompare(b.name.en))
          : [...fishData].sort((a, b) => b.name.en.localeCompare(a.name.en))
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
  return {
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    sortedFish,
  }
}
