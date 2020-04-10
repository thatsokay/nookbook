import React, {useState} from 'react'
import {
  CssBaseline,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
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

const App = () => {
  const [filterActive, setFilterActive] = useState(false)

  const now = new Date()
  const month = now.getMonth()
  const hour = now.getHours()

  const filteredFish = filterActive
    ? fishData.filter(
        (fish) =>
          fish.months.some((bounds) => moduloBetween(bounds, month)) &&
          fish.hours.some((bounds) => moduloBetween(bounds, hour)),
      )
    : fishData

  return (
    <>
      <CssBaseline />
      <Container>
        <Typography variant="h2" component="h1" align="center">
          Animal Crossing Fish
        </Typography>
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={filterActive}
                onChange={(event) => setFilterActive(event.target.checked)}
              />
            }
            label="Active now"
            labelPlacement="start"
          />
        </FormGroup>
        <Grid container spacing={3}>
          {filteredFish.map((fish) => (
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
