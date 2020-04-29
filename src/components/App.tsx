import React, {useState, useMemo} from 'react'
import {
  makeStyles,
  useMediaQuery,
  createMuiTheme,
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Grid,
  Button,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core'
import {lightBlue, teal} from '@material-ui/core/colors'
import {Brightness6, SortByAlpha, ExpandMore} from '@material-ui/icons'

import RadioButtons from './RadioButtons'
import FishCard from './FishCard'
import BugCard from './BugCard'
import {
  useHemisphere,
  useActiveTimeFilter,
  useLocationFilter,
  useSort,
} from '../filters'
import {useDarkMode} from '../utilities'
import fishData from '../../assets/fish.json'
import bugData from '../../assets/bugs.json'

const imageCache = (
  <Box hidden>
    {fishData.map(({id}) => (
      <img
        src={require('../../assets/img/fish/fish' +
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

  const [critterType, setCritterType] = useState<'fish' | 'bugs'>('fish')
  const handleCritterTypeChange = (critter: typeof critterType) => () =>
    setCritterType(critter)

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
          primary:
            critterType === 'fish'
              ? darkMode
                ? {
                    light: lightBlue[600],
                    main: lightBlue[800],
                    dark: lightBlue[900],
                  }
                : {
                    light: lightBlue[50],
                    main: lightBlue[200],
                    dark: lightBlue[500],
                  }
              : darkMode
              ? {
                  light: teal[400],
                  main: teal[700],
                  dark: teal[900],
                }
              : {
                  light: teal[50],
                  main: teal[200],
                  dark: teal[300],
                },
          secondary: critterType === 'fish' ? lightBlue : teal,
        },
      }),
    [darkMode, critterType],
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
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters>
            <Box flexGrow={1}>
              <Typography variant="h6">NookBook</Typography>
            </Box>
            <Button
              onClick={handleCritterTypeChange('fish')}
              color="inherit"
              disabled={critterType === 'fish'}
            >
              Fish
            </Button>
            <Button
              onClick={handleCritterTypeChange('bugs')}
              color="inherit"
              disabled={critterType === 'bugs'}
            >
              Bugs
            </Button>
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
              <Brightness6 />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
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
          {critterType === 'fish'
            ? sortedFish.map((fish) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={fish.id}>
                  <FishCard fish={fish} />
                </Grid>
              ))
            : bugData.map((bug) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={bug.id}>
                  <BugCard bug={bug} />
                </Grid>
              ))}
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default App
