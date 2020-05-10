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
import Footer from './Footer'
import {useDarkMode} from '../utilities'
import fishData from '../../assets/fish.json'
import bugData from '../../assets/bugs.json'

const blue = {
  light: '#bbffff',
  main: '#87e1ea',
  dark: '#53afb8',
}
const green = {
  light: '#ccffeb',
  main: '#99edb9',
  dark: '#68ba89',
}

const fishImageCache = (
  <Box hidden>
    {fishData.map(({id}) => (
      <img
        src={require('../../assets/img/fish/fish' +
          `${id}`.padStart(2, '0') +
          '.png')}
        key={`fish-${id}`}
      />
    ))}
  </Box>
)

const bugImageCache = (
  <Box hidden>
    {bugData.map(({id}) => (
      <img
        src={require('../../assets/img/bugs/ins' +
          `${id}`.padStart(2, '0') +
          '.png')}
        key={`bug-${id}`}
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
      {critterPage === 'fish' ? fishImageCache : bugImageCache}
      <Box minHeight="100vh" display="flex" flexDirection="column">
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
              <IconButton
                color="inherit"
                onClick={() => setDarkMode(!darkMode)}
              >
                <Brightness6 />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
        <Box flexGrow={1} marginBottom="2rem">
          <Container>
            {critterPage === 'fish' ? (
              <FishPage fish={fishData} />
            ) : (
              <BugPage bugs={bugData} />
            )}
          </Container>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default App
