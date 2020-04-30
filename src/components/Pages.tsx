import React, {useMemo} from 'react'
import {
  makeStyles,
  useTheme,
  useMediaQuery,
  Box,
  Grid,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core'
import {ExpandMore} from '@material-ui/icons'

import FishCard from './FishCard'
import BugCard from './BugCard'
import {
  HemisphereControl,
  ActiveTimeControl,
  FishLocationControl,
  FishSortControl,
  BugLocationControl,
  BugSortControl,
} from './Controls'
import {
  useHemisphere,
  useActiveTimeFilter,
  useFishLocationFilter,
  useFishSort,
  useBugLocationFilter,
  useBugSort,
} from '../filters'
import {Fish, Bug} from '../types'

const useStyles = makeStyles({
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *:not(:last-child)': {
      marginBottom: '0.5rem',
      marginRight: '1.5rem',
    },
  },
})

export const FishPage = ({fish}: {fish: Fish[]}) => {
  const classes = useStyles()
  const theme = useTheme()
  const lgViewport = useMediaQuery(theme.breakpoints.up('lg'))

  const [hemisphereFish, hemisphereControlProps] = useHemisphere(fish)
  const [activeTimeFilteredFish, activeTimeControlProps] = useActiveTimeFilter(
    hemisphereFish,
  )
  const [
    locationFilteredFish,
    fishLocationControlProps,
  ] = useFishLocationFilter(activeTimeFilteredFish)
  const [sortedFish, fishSortControlProps] = useFishSort(locationFilteredFish)

  const Controls = useMemo(
    () => (
      <Box className={classes.controls} justifyContent="space-between">
        <Box className={classes.controls}>
          <HemisphereControl {...hemisphereControlProps} />
          <ActiveTimeControl {...activeTimeControlProps} />
          <FishLocationControl {...fishLocationControlProps} />
        </Box>
        <Box className={classes.controls}>
          <FishSortControl {...fishSortControlProps} />
        </Box>
      </Box>
    ),
    [
      hemisphereControlProps,
      activeTimeControlProps,
      fishLocationControlProps,
      fishSortControlProps,
    ],
  )

  return (
    <>
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
    </>
  )
}

export const BugPage = ({bugs}: {bugs: Bug[]}) => {
  const classes = useStyles()
  const theme = useTheme()
  const lgViewport = useMediaQuery(theme.breakpoints.up('lg'))

  const [hemisphereBugs, hemisphereControlProps] = useHemisphere(bugs)
  const [activeTimeFilteredBugs, activeTimeControlProps] = useActiveTimeFilter(
    hemisphereBugs,
  )
  const [locationFilteredBugs, bugLocationControlProps] = useBugLocationFilter(
    activeTimeFilteredBugs,
  )
  const [sortedBugs, bugSortControlProps] = useBugSort(locationFilteredBugs)

  const Controls = useMemo(
    () => (
      <Box className={classes.controls} justifyContent="space-between">
        <Box className={classes.controls}>
          <HemisphereControl {...hemisphereControlProps} />
          <ActiveTimeControl {...activeTimeControlProps} />
          <BugLocationControl {...bugLocationControlProps} />
        </Box>
        <Box className={classes.controls}>
          <BugSortControl {...bugSortControlProps} />
        </Box>
      </Box>
    ),
    [
      hemisphereControlProps,
      activeTimeControlProps,
      bugLocationControlProps,
      bugSortControlProps,
    ],
  )

  return (
    <>
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
        {sortedBugs.map((bug) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={bug.id}>
            <BugCard bug={bug} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}
