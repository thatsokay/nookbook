import React from 'react'
import {SortByAlpha} from '@material-ui/icons'

import RadioButtons from './RadioButtons'
import {
  useHemisphere,
  useActiveTimeFilter,
  useFishLocationFilter,
  useFishSort,
  useBugLocationFilter,
  useBugSort,
} from '../filters'

export const HemisphereControl = ({
  hemisphere,
  setHemisphere,
}: ReturnType<typeof useHemisphere>[1]) => (
  <RadioButtons
    label="Hemisphere"
    options={[
      {name: 'Northern', value: 'north'},
      {name: 'Southern', value: 'south'},
    ]}
    selected={hemisphere}
    onChange={setHemisphere}
  />
)

export const ActiveTimeControl = ({
  activeTimeFilter,
  setActiveTimeFilter,
}: ReturnType<typeof useActiveTimeFilter>[1]) => (
  <RadioButtons
    label="Active"
    options={[
      {name: 'Anytime', value: 'any'},
      {name: 'Now', value: 'now'},
      {name: 'This month', value: 'month'},
    ]}
    selected={activeTimeFilter}
    onChange={setActiveTimeFilter}
  />
)

export const FishLocationControl = ({
  locationFilter,
  setLocationFilter,
}: ReturnType<typeof useFishLocationFilter>[1]) => (
  <RadioButtons
    label="Location"
    options={[
      {name: 'All', value: 'all'},
      {name: 'River', value: 'river'},
      {name: 'Pond', value: 'pond'},
      {name: 'Sea', value: 'sea'},
      {name: 'Pier', value: 'pier'},
    ]}
    selected={locationFilter}
    onChange={setLocationFilter}
  />
)

export const FishSortControl = ({
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
}: ReturnType<typeof useFishSort>[1]) => (
  <>
    <RadioButtons
      label="Sort by"
      options={[
        {name: 'Default', value: 'default'},
        {name: 'Name', value: 'name'},
        {name: 'Price', value: 'price'},
        {name: 'Size', value: 'size'},
      ]}
      selected={sortBy}
      onChange={setSortBy}
    />
    <RadioButtons
      label={<SortByAlpha style={{display: 'block'}} viewBox="0 0 25 25" />}
      options={[
        {name: 'Asc', value: 'asc'},
        {name: 'Desc', value: 'desc'},
      ]}
      selected={sortDirection}
      onChange={setSortDirection}
    />
  </>
)

export const BugLocationControl = ({
  locationFilter,
  setLocationFilter,
}: ReturnType<typeof useBugLocationFilter>[1]) => (
  <RadioButtons
    label="Location"
    options={[
      {name: 'All', value: 'all'},
      {name: 'Ground', value: 'ground'},
      {name: 'Trees', value: 'tree'},
      {name: 'Flowers', value: 'flower'},
      {name: 'Other', value: 'other'},
    ]}
    selected={locationFilter}
    onChange={setLocationFilter}
  />
)

export const BugSortControl = ({
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
}: ReturnType<typeof useBugSort>[1]) => (
  <>
    <RadioButtons
      label="Sort by"
      options={[
        {name: 'Default', value: 'default'},
        {name: 'Name', value: 'name'},
        {name: 'Price', value: 'price'},
      ]}
      selected={sortBy}
      onChange={setSortBy}
    />
    <RadioButtons
      label={<SortByAlpha style={{display: 'block'}} viewBox="0 0 25 25" />}
      options={[
        {name: 'Asc', value: 'asc'},
        {name: 'Desc', value: 'desc'},
      ]}
      selected={sortDirection}
      onChange={setSortDirection}
    />
  </>
)
