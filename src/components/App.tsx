import React, {useMemo} from 'react'
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
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core'
import {Brightness6, SortByAlpha, ExpandMore} from '@material-ui/icons'

import RadioButtons from './RadioButtons'
import FishCard from './FishCard'
import {
  useHemisphere,
  useActiveTimeFilter,
  useLocationFilter,
  useSort,
} from '../filters'
import {useDarkMode} from '../utilities'
import fishData from '../../assets/fish.json'

const imageCache = (
  <Box hidden>
    {fishData.map(({id}) => (
      <img
        src={require('../../assets/img/fish' +
          `${id}`.padStart(2, '0') +
          '.png')}
        key={id}
      />
    ))}
  </Box>
)

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

  const {hemisphere, setHemisphere, hemisphereFish} = useHemisphere(fishData)
  const {
    activeTimeFilter,
    setActiveTimeFilter,
    activeTimeFilteredFish,
  } = useActiveTimeFilter(hemisphereFish)
  const {
    locationFilter,
    setLocationFilter,
    locationFilteredFish,
  } = useLocationFilter(activeTimeFilteredFish)
  const {
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    sortedFish,
  } = useSort(locationFilteredFish)

  const [darkMode, setDarkMode] = useDarkMode()
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
        label={<SortByAlpha style={{display: 'block'}} viewBox="0 0 25 25" />}
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
      {imageCache}
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
              <Grid item xs={12} sm={6} md={4} lg={3} key={fish.id}>
                <FishCard fish={fish} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
