import React from 'react'
import CritterCard, {Bug} from './CritterCard'

const BugCard = ({bug}: {bug: Bug}) => (
  <CritterCard
    critter={bug}
    imageSrc={
        require('../../assets/img/bugs/ins' +
          `${bug.id}`.padStart(2, '0') +
          '.png')}
    summary={''}
  />
)

export default BugCard
