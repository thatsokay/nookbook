import React, {useState} from 'react'
import {
  makeStyles,
  Box,
  Typography,
  Card,
  CardContent,
  Collapse,
  IconButton,
} from '@material-ui/core'
import {ExpandMore, CalendarToday, Schedule} from '@material-ui/icons'

import fishData from '../../assets/fish.json'

const shadowSizes = [
  'Tiny',
  'Small',
  'Medium',
  'Large',
  'Very Large',
  'Huge',
] as const

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

const useStyles = makeStyles((theme) => {
  const expandToggle = {
    padding: '0',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }
  return {
    expandToggleClosed: {
      ...expandToggle,
      transform: 'rotate(0deg)',
    },
    expandToggleOpen: {
      ...expandToggle,
      transform: 'rotate(180deg)',
    },
  }
})

const FishCard = ({fish}: {fish: typeof fishData[number]}) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)
  return (
    <Card>
      <CardContent>
        <Box display="flex">
          <img
            src={require(`../../assets/${fish.image.path}`)}
            style={{width: '3.25rem', height: '3.25rem'}}
          />
          <Box flex={1} paddingLeft="0.5rem">
            <Typography variant="h6" component="h2">
              {fish.name}
            </Typography>
            <Typography variant="body2">
              ฿{fish.price} • {fish.location} •{' '}
              {shadowSizes[fish.shadow.size - 1]} {fish.shadow.comment}
            </Typography>
          </Box>
          <Box
            onClick={() => setExpanded(!expanded)}
            display="flex"
            alignItems="center"
          >
            <IconButton
              className={
                expanded ? classes.expandToggleOpen : classes.expandToggleClosed
              }
            >
              <ExpandMore />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
      <Collapse in={expanded}>
        <CardContent>
          <Box
            display="grid"
            gridGap="0.5rem"
            gridTemplateColumns="3.25rem 1fr"
          >
            <Box display="flex" justifyContent="center" alignItems="center">
              <CalendarToday viewBox="-3 0 30 30" />
            </Box>
            <Box>
              {fish.months.map(({start, end}) => (
                <Typography variant="body2" component="p">
                  {start === 0 && end === 0
                    ? 'All year'
                    : `${monthNames[start]} - ${monthNames[end]}`}
                </Typography>
              ))}
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Schedule viewBox="-3 0 30 30" />
            </Box>
            <Box>
              {fish.hours.map(({start, end}) => (
                <Typography variant="body2" component="p">
                  {start === 0 && end === 0
                    ? 'All day'
                    : `${start}`.padStart(2, '0') +
                      ':00 - ' +
                      `${end}`.padStart(2, '0') +
                      ':00'}
                </Typography>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default FishCard
