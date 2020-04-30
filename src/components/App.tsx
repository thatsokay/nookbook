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
import {lightBlue, teal} from '@material-ui/core/colors'
import {Brightness6} from '@material-ui/icons'

import {FishPage, BugPage} from './Pages'
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

const App = () => {
  const [critterPage, setCritterPage] = useState<'fish' | 'bugs'>('fish')
  const handleCritterTypeChange = (critter: typeof critterPage) => () =>
    setCritterPage(critter)

  const [darkMode, setDarkMode] = useDarkMode()
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
          primary:
            critterPage === 'fish'
              ? darkMode
                ? {
                    light: lightBlue[600],
                    main: lightBlue[800],
                    dark: lightBlue[900],
                  }
                : {
                    light: lightBlue[50],
                    main: lightBlue[200],
                    dark: lightBlue[300],
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
          secondary: critterPage === 'fish' ? lightBlue : teal,
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
            <Button
              onClick={handleCritterTypeChange('fish')}
              color="inherit"
              disabled={critterPage === 'fish'}
            >
              Fish
            </Button>
            <Button
              onClick={handleCritterTypeChange('bugs')}
              color="inherit"
              disabled={critterPage === 'bugs'}
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
