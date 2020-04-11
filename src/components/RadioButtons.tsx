import React from 'react'
import {Typography, ButtonGroup, Button} from '@material-ui/core'

interface Props<T> {
  options: {
    name: string
    value: T
  }[]
  selected: T
  onChange: (selected: T) => void
  label?: string
}

// `extends unknown` is needed so TS doesn't think it's JSX
const RadioButtons = <T extends unknown>(props: Props<T>) => (
  <>
    {props.label && <Typography variant="button">{props.label}: </Typography>}
    <ButtonGroup variant="contained">
      {props.options.map((option) => (
        <Button
          onClick={() => props.onChange(option.value)}
          color={props.selected === option.value ? 'primary' : 'default'}
          disableElevation
          key={`${option.name}-${option.value}`}
        >
          {option.name}
        </Button>
      ))}
    </ButtonGroup>
  </>
)

export default RadioButtons
