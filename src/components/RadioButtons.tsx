import React from 'react'
import {Box, Typography, ButtonGroup, Button} from '@material-ui/core'

interface Props<T> {
  options: {
    name: string
    value: T
  }[]
  selected: T
  onChange: (selected: T) => void
  label?: string | React.ReactElement
}

// `extends unknown` is needed so TS doesn't think it's JSX
const RadioButtons = <T extends unknown>(props: Props<T>) => (
  <Box>
    {(() => {
      switch (typeof props.label) {
        case 'undefined':
          return <></>
        case 'string':
          return (
            <Typography variant="button" component="p">
              {props.label}
            </Typography>
          )
        default:
          return props.label
      }
    })()}
    <ButtonGroup variant="contained" size="small">
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
  </Box>
)

export default RadioButtons
