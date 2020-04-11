import React from 'react'
import {Box, Typography} from '@material-ui/core'

import fishData from '../../assets/fish.json'

const shadowSizes = [
  'Tiny',
  'Small',
  'Medium',
  'Large',
  'Very Large',
  'Huge',
] as const

const FishContent = ({fish}: {fish: typeof fishData[number]}) => (
  <Box display="flex">
    <img
      src={require(`../../assets/${fish.image.path}`)}
      style={{height: '3.25rem'}}
    />
    <Box paddingLeft="0.5rem">
      <Typography variant="h6" component="h2">
        {fish.name}
      </Typography>
      <Typography variant="body2">
        ₿{fish.price} • {fish.location} • {shadowSizes[fish.shadow.size - 1]}{' '}
        {fish.shadow.comment}
      </Typography>
    </Box>
  </Box>
)

export default FishContent
