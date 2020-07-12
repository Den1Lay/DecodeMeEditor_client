import React from 'react'

import {Branch, Notes, Main, Navbar, Map} from '@/containers'

import './Base.scss';

const Base = () => {
  return(
    <section className='base'>
      <Navbar />
      <div className='base__mainPart'>
        <Branch />
        <div className='base__workPlace'>
          <Main />
          <Notes />
          {/**<Map /> */}
        </div>
      </div>
    </section>
  )
}

export default Base