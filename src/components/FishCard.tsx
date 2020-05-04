import React, {memo} from 'react'

import CritterCard from './CritterCard'
import {Fish} from '../types'

const shadowSizes = [
  'Tiny',
  'Small',
  'Medium',
  'Narrow',
  'Large',
  'Very Large',
  'Huge',
] as const

const FishCard = ({fish}: {fish: Fish}) => (
  <CritterCard
    critter={fish}
    imageSrc={require('../../assets/img/fish/fish' +
      `${fish.id}`.padStart(2, '0') +
      '.png')}
    summary={`฿${fish.price} • ${fish.location} • ${
      shadowSizes[fish.shadow.size]
    }${fish.shadow.finned ? ' (fin)' : ''}`}
  />
)

export default memo(
  FishCard,
  (prevProps, nextProps) => prevProps.fish.id === nextProps.fish.id,
)
