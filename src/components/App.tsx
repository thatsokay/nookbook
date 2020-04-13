import React, {useState, useEffect, useMemo} from 'react'
import {
  makeStyles,
  useMediaQuery,
  createMuiTheme,
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Grid,
  IconButton,
  Card,
  CardContent,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core'
import {Brightness6, SortByAlpha, ExpandMore} from '@material-ui/icons'

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
  themeToggleButton: {
    position: 'absolute',
    top: '0.8rem',
    right: '0',
  },
  themeToggleIcon: {
    width: '2rem',
    height: '2rem',
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *:not(:last-child)': {
      marginBottom: '0.5rem',
      marginRight: '1.5rem',
    },
  },
})

const App = () => {
  const classes = useStyles()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const [darkMode, setDarkMode] = useState(prefersDarkMode)
  const [hemisphere, setHemisphere] = useState<'north' | 'south'>('north')
  const [activeTimeFilter, setActiveTimeFilter] = useState<
    'any' | 'now' | 'month'
  >('any')
  const [locationFilter, setLocationFilter] = useState<
    'all' | 'river' | 'pond' | 'sea' | 'pier'
  >('all')
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'price' | 'size'>(
    'default',
  )
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // `preferDarkMode` starts as false then changes to true when the query
  // return true. `useEffect` needed to corret the initial `darkMode` value.
  useEffect(() => setDarkMode(prefersDarkMode), [prefersDarkMode])
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  )
  const lgViewport = useMediaQuery(theme.breakpoints.up('lg'))

  const hemisphereFish = useMemo(
    () =>
      hemisphere == 'north'
        ? fishData
        : fishData.map((fish) => ({
            ...fish,
            months: fish.months.map((months) => ({
              start: (months.start + 6) % 12,
              end: (months.end + 6) % 12,
            })),
          })),
    [hemisphere],
  )

  const activeTimeFilteredFish = useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const hour = now.getHours()
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
  }, [activeTimeFilter, hemisphereFish])

  const locationFilteredFish = useMemo(() => {
    switch (locationFilter) {
      case 'all':
        return activeTimeFilteredFish
      default:
        return activeTimeFilteredFish.filter((fish) =>
          fish.location.toLowerCase().startsWith(locationFilter),
        )
    }
  }, [locationFilter, activeTimeFilteredFish])

  const sortedFish = useMemo(() => {
    switch (sortBy) {
      case 'default':
        return sortDirection === 'asc'
          ? locationFilteredFish
          : [...locationFilteredFish].reverse()
      case 'name':
        return sortDirection === 'asc'
          ? [...locationFilteredFish].sort((a, b) =>
              a.name.localeCompare(b.name),
            )
          : [...locationFilteredFish].sort((a, b) =>
              b.name.localeCompare(a.name),
            )
      case 'price':
        return sortDirection === 'asc'
          ? [...locationFilteredFish].sort((a, b) => a.price - b.price)
          : [...locationFilteredFish].sort((a, b) => b.price - a.price)
      case 'size':
        return sortDirection === 'asc'
          ? [...locationFilteredFish].sort(
              (a, b) => a.shadow.size - b.shadow.size,
            )
          : [...locationFilteredFish].sort(
              (a, b) => b.shadow.size - a.shadow.size,
            )
    }
  }, [locationFilteredFish, sortBy, sortDirection])

  const hemisphereControl = useMemo(
    () => (
      <RadioButtons
        label="Hemisphere"
        options={[
          {name: 'Northern', value: 'north'},
          {name: 'Southern', value: 'south'},
        ]}
        selected={hemisphere}
        onChange={setHemisphere}
      />
    ),
    [hemisphere, setHemisphere],
  )

  const activeTimeControl = useMemo(
    () => (
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
    ),
    [activeTimeFilter, setActiveTimeFilter],
  )

  const locationControl = useMemo(
    () => (
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
    ),
    [locationFilter, setLocationFilter],
  )

  const sortByControl = useMemo(
    () => (
      <RadioButtons
        label="Sort by"
        options={[
          {name: 'Default', value: 'default'},
          {name: 'Name', value: 'name'},
          {name: 'Price', value: 'price'},
          {name: 'Size', value: 'size'},
        ]}
        selected={sortBy}
        onChange={setSortBy}
      />
    ),
    [sortBy, setSortBy],
  )

  const sortDirectionControl = useMemo(
    () => (
      <RadioButtons
        label={<SortByAlpha style={{display: 'block'}} viewBox="0 -1 24 25" />}
        options={[
          {name: 'Asc', value: 'asc'},
          {name: 'Desc', value: 'desc'},
        ]}
        selected={sortDirection}
        onChange={setSortDirection}
      />
    ),
    [sortDirection, setSortDirection],
  )

  const Controls = useMemo(
    () => (
      <Box className={classes.controls} justifyContent="space-between">
        <Box className={classes.controls}>
          {hemisphereControl}
          {activeTimeControl}
          {locationControl}
        </Box>
        <Box className={classes.controls}>
          {sortByControl}
          {sortDirectionControl}
        </Box>
      </Box>
    ),
    [
      hemisphereControl,
      activeTimeControl,
      locationControl,
      sortByControl,
      sortDirectionControl,
    ],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box position="relative">
          <IconButton
            className={classes.themeToggleButton}
            onClick={() => setDarkMode(!darkMode)}
          >
            <Brightness6 className={classes.themeToggleIcon} />
          </IconButton>
          <Typography variant="h2" component="h1" align="center" gutterBottom>
            Animal Crossing Fish
          </Typography>
          <Box margin="1.5rem 0">
            {lgViewport ? (
              Controls
            ) : (
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                  <Typography variant="button">Filters</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>{Controls}</ExpansionPanelDetails>
              </ExpansionPanel>
            )}
          </Box>
          <Grid container spacing={3}>
            {sortedFish.map((fish) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={fish.name}>
                <Card>
                  <CardContent>
                    <FishContent fish={fish} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
