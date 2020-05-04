import React, {memo} from 'react'

import CritterCard from './CritterCard'
import {Bug} from '../types'

const shortenLocation = (location: string) => {
  const shorten: [RegExp, string][] = [
    [/Flying near .+ flowers/, 'Flying near flowers'],
    [/Flying near light sources/, 'Flying near light'],
    [
      /Flying near trash .+ or rotten turnips/,
      'Flying near trash or rotten turnips',
    ],
    [/On .+ flowers/, 'On flowers'],
    [/On .+ trees/, 'On trees'],
    [/On trees .+/, 'On trees'],
    [/Shaking trees .+/, 'Shaking trees'],
    [/Underground .+/, 'Underground'],
  ]
  const shortened = shorten.find(([pattern, _]) => location.match(pattern))
  return shortened ? shortened[1] : location
}

const BugCard = ({bug}: {bug: Bug}) => (
  <CritterCard
    critter={bug}
    imageSrc={require('../../assets/img/bugs/ins' +
      `${bug.id}`.padStart(2, '0') +
      '.png')}
    summary={`฿${bug.price} • ${shortenLocation(bug.location)}`}
  />
)

export default memo(
  BugCard,
  (prevProps, nextProps) =>
    prevProps.bug.id === nextProps.bug.id &&
    // Check same hemisphere
    prevProps.bug.active.months[0]?.start ===
      nextProps.bug.active.months[0]?.start,
)
