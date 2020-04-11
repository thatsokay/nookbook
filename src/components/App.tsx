import React, {useState} from 'react'
import {
  makeStyles,
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

const useStyles = makeStyles({
  filters: {
    display: 'flex',
    margin: '1.5rem 0',
    '& > *:not(:first-child)': {
      marginLeft: '1.5rem',
    },
  },
})

const App = () => {
  const classes = useStyles()

  const [hemisphere, setHemisphere] = useState<'north' | 'south'>('north')
  const [activeTimeFilter, setActiveTimeFilter] = useState<
    'any' | 'now' | 'month'
  >('any')
  const [locationFilter, setLocationFilter] = useState<
    'all' | 'river' | 'pond' | 'sea' | 'pier'
  >('all')

  const hemisphereFish =
    hemisphere == 'north'
      ? fishData
      : fishData.map((fish) => ({
          ...fish,
          months: fish.months.map((months) => ({
            start: (months.start + 6) % 12,
            end: (months.end + 6) % 12,
          })),
        }))

  const now = new Date()
  const month = now.getMonth()
  const hour = now.getHours()
  const activeTimeFilteredFish = (() => {
    switch (activeTimeFilter) {
      case 'any':
        return hemisphereFish
      case 'now':
        return hemisphereFish.filter(
          (fish) =>
            fish.months.some((bounds) => moduloBetween(bounds, month)) &&
            fish.hours.some((bounds) => moduloBetween(bounds, hour)),
        )
      case 'month':
        return hemisphereFish.filter((fish) =>
          fish.months.some((bounds) => moduloBetween(bounds, month)),
        )
    }
  })()

  const locationFilteredFish = (() => {
    switch (locationFilter) {
      case 'all':
        return activeTimeFilteredFish
      default:
        return activeTimeFilteredFish.filter((fish) =>
          fish.location.toLowerCase().startsWith(locationFilter),
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
        <Box className={classes.filters}>
          <RadioButtons
            label="Hemisphere"
            options={[
              {name: 'Northern', value: 'north'},
              {name: 'Southern', value: 'south'},
            ]}
            selected={hemisphere}
            onChange={setHemisphere}
          />
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
        </Box>
        <Grid container spacing={3}>
          {locationFilteredFish.map((fish) => (
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
