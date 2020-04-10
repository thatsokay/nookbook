import React from 'react'
import {Box, Grid, Card, CardContent, Typography} from '@material-ui/core'

import fish from '../../assets/fish.json'

const shadowSizes = ['Tiny', 'Small', 'Medium', 'Large', 'Very Large', 'Huge']

const App = () => {
  return (
    <>
      <h1>Animal Crossing</h1>
      <Grid container spacing={3}>
        {fish.map((fish) => (
          <Grid item xs={3}>
            <Card>
              <CardContent>
                <Box display="flex">
                  <img
                    src={require(`../../assets/${fish.image.path}`)}
                    style={{height: '4rem'}}
                  />
                  <Box>
                    <Typography variant="h6" component="h2">
                      {fish.name}
                    </Typography>
                    <Typography variant="body2">
                      ₿{fish.price} • {fish.location} •{' '}
                      {shadowSizes[fish.shadow.size - 1]} {fish.shadow.comment}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default App
