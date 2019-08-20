import React, { Component } from 'react'

const ThemeContext = React.createContext('light')

export class ThemeProvider extends Component {
  render () {
    const { children, value = 'dark' } = this.props

    return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
    )
  }
}

export default ThemeContext
