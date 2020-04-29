import React from 'react'
import CritterCard, {Bug} from './CritterCard'

const shortenLocation = (location: string) => {
  const shorten: [RegExp, string][] = [
    [/Flying near .+ flowers/, 'flying near flowers'],
    [/Flying near light sources/, 'flying near light'],
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

export default BugCard
