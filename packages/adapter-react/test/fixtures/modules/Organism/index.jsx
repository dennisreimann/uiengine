import React from 'react'
import Atom from '@uiengine/adapter-react/test/fixtures/elements/Atom'
import Molecule from '@uiengine/adapter-react/test/fixtures/modules/Molecule'

export default props => (
  <div className='organism'>
    <Atom />
    <Molecule>molecule</Molecule>
  </div>
)
