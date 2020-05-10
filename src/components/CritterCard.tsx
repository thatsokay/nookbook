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

import {Critter} from '../types'

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
    capitalize: {
      textTransform: 'capitalize',
    },
    cardImage: {
      width: '3.25rem',
      height: '3.25rem',
    },
  }
})

interface CritterProps {
  critter: Critter
  imageSrc: string
  summary: string
}

const CritterCard = ({critter, summary, imageSrc}: CritterProps) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)
  return (
    <Card>
      <CardContent onClick={() => setExpanded(!expanded)}>
        <Box display="flex">
          <img src={imageSrc} className={classes.cardImage} />
          <Box flex={1} paddingLeft="0.5rem">
            <Typography
              className={classes.capitalize}
              variant="h6"
              component="h2"
            >
              {critter.name}
            </Typography>
            <Typography variant="body2">{summary}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
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
            <DetailRow
              icon={<CalendarToday viewBox="-3 0 30 30" />}
              periods={critter.active.months}
              periodFormatter={({start, end}) =>
                start === end
                  ? 'All year'
                  : end - start === 1
                  ? monthNames[start] // 1 month duration
                  : monthNames[start] +
                    ' - ' +
                    // Change end month to inclusive.
                    // Javascript `%` is remainder rather than modulo and
                    // returns negative when the first argument is negative.
                    monthNames[(end + 12 - 1) % 12]
              }
            />
            <DetailRow
              icon={<Schedule viewBox="-3 0 30 30" />}
              periods={critter.active.hours}
              periodFormatter={({start, end}) =>
                start === end
                  ? 'All day'
                  : `${start}`.padStart(2, '0') +
                    ':00 - ' +
                    `${end}`.padStart(2, '0') +
                    ':00'
              }
            />
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  )
}

interface DetailRowProps {
  icon: JSX.Element
  periods: {start: number; end: number}[]
  periodFormatter: (period: {start: number; end: number}) => string
}

const DetailRow = (props: DetailRowProps) => (
  <>
    <Box display="flex" justifyContent="center" alignItems="center">
      {props.icon}
    </Box>
    <Box>
      {props.periods.map((period) => (
        <Typography
          variant="body2"
          component="p"
          key={`${period.start}-${period.end}`}
        >
          {props.periodFormatter(period)}
        </Typography>
      ))}
    </Box>
  </>
)

export default CritterCard
