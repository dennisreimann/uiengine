import React from 'react'
import ThemeContext, { ThemeProvider } from './ThemeContext'

export default () => (
  <ThemeProvider>
    <ThemeContext.Consumer>
      {context => (<h1>Context: {context}</h1>)}
    </ThemeContext.Consumer>
  </ThemeProvider>
)
