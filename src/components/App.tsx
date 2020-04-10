import React from 'react'
import {
  CssBaseline,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core'

import fishData from '../../assets/fish.json'

const shadowSizes = [
  'Tiny',
  'Small',
  'Medium',
  'Large',
  'Very Large',
  'Huge',
] as const

const App = () => {
  return (
    <>
      <CssBaseline />
      <Container>
        <Typography variant="h2" component="h1" align="center">
          Animal Crossing Fish
        </Typography>
        <Grid container spacing={3}>
          {fishData.map((fish) => (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardContent>
                  <FishContent fish={fish} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}

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

export default App
