import React from 'react'
import {makeStyles, Box, Paper, Typography, Link} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  link: {
    color:
      theme.palette.type === 'dark'
        ? theme.palette.primary.main
        : theme.palette.primary.dark,
  },
}))

const Footer = () => {
  const classes = useStyles()
  return (
    <Paper component="footer" square={true} elevation={8}>
      <Box padding="2rem">
        <Typography align="center" color="textSecondary">
          Data sourced from the{' '}
          <Link
            className={classes.link}
            href="https://docs.google.com/spreadsheets/d/13d_LAJPlxMa_DubPTuirkIV4DERBMXbrWQsmSh8ReK4"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
          >
            ACNH spreadsheet
          </Link>
        </Typography>
      </Box>
    </Paper>
  )
}

export default Footer
