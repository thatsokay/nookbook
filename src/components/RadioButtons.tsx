import React from 'react'
import {
  Typography,
  ButtonGroup,
  Button,
} from '@material-ui/core'

interface Props<T> {
  label: string
  options: T[]
  selected: T
  onChange: (selected: T) => void
}

const RadioButtons = <T extends string>(props: Props<T>) => (
  <>
    <Typography variant="button">{props.label}: </Typography>
    <ButtonGroup variant="contained">
      {props.options.map((option) => (
        <Button
          onClick={() => props.onChange(option)}
          color={props.selected === option ? 'primary' : 'default'}
          disableElevation
        >
          {option}
        </Button>
      ))}
    </ButtonGroup>
  </>
)

export default RadioButtons
