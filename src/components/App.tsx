import React, {useState} from 'react'
import {
  CssBaseline,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core'

import RadioButtons from './RadioButtons'
import FishContent from './FishContent'
import fishData from '../../assets/fish.json'

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
  const [fishActiveFilter, setActiveFishFilter] = useState<
    'any' | 'now' | 'month'
  >('any')

  const now = new Date()
  const month = now.getMonth()
  const hour = now.getHours()

  const filteredFish = (() => {
    switch (fishActiveFilter) {
      case 'any':
        return fishData
      case 'now':
        return fishData.filter(
          (fish) =>
            fish.months.some((bounds) => moduloBetween(bounds, month)) &&
            fish.hours.some((bounds) => moduloBetween(bounds, hour)),
        )
      case 'month':
        return fishData.filter((fish) =>
          fish.months.some((bounds) => moduloBetween(bounds, month)),
        )
    }
  })()

  return (
    <>
      <CssBaseline />
      <Container>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Animal Crossing Fish
        </Typography>
        <Box margin="1rem 0">
          <RadioButtons
            label="Active"
            options={[
              {name: 'Anytime', value: 'any'},
              {name: 'Now', value: 'now'},
              {name: 'This month', value: 'month'},
            ]}
            selected={fishActiveFilter}
            onChange={setActiveFishFilter}
          />
        </Box>
        <Grid container spacing={3}>
          {filteredFish.map((fish) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={fish.name}>
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

export default App
