import React from 'react'
import Atom from '../../elements/Atom'

// simulate the use of css modules
import s from './Molecule.css'

export default props => (
  <div className={s.molecule}>
    <Atom />
  </div>
)
