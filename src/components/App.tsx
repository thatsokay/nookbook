import React, {useState} from 'react'
import {
  createMuiTheme,
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Button,
  IconButton,
  Typography,
  AppBar,
  Toolbar,
} from '@material-ui/core'
import {Brightness6} from '@material-ui/icons'

import {FishPage, BugPage} from './Pages'
import {useDarkMode} from '../utilities'
import fishData from '../../assets/fish.json'
import bugData from '../../assets/bugs.json'

const blue = {
  light: '#b8f2f7',
  main: '#87e1ea',
  dark: '#5dcdd7',
}
const green = {
  light: '#c8f9da',
  main: '#99edb9',
  dark: '#6fdb97',
}

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

const App = () => {
  const [critterPage, setCritterPage] = useState<'fish' | 'bugs'>('fish')
  const handleCritterTypeChange = (critter: typeof critterPage) => () =>
    setCritterPage(critter)

  const [darkMode, setDarkMode] = useDarkMode()
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        // Default palette:
        // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/createPalette.js#L96
        palette: {
          type: darkMode ? 'dark' : 'light',
          primary: critterPage === 'fish' ? blue : green,
          secondary: critterPage === 'fish' ? green : blue,
        },
      }),
    [darkMode, critterPage],
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
            <Button onClick={handleCritterTypeChange('fish')} color="inherit">
              Fish
            </Button>
            <Button onClick={handleCritterTypeChange('bugs')} color="inherit">
              Bugs
            </Button>
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
              <Brightness6 />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        {critterPage === 'fish' ? (
          <FishPage fish={fishData} />
        ) : (
          <BugPage bugs={bugData} />
        )}
      </Container>
    </ThemeProvider>
  )
}

export default App
