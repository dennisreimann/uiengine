import React from 'react'
import Atom from '@uiengine/adapter-react/test/fixtures/elements/Atom'
import Molecule from '../Molecule'

export default props => (
  <div className='organism'>
    <Atom />
    <Molecule>molecule</Molecule>
  </div>
)
