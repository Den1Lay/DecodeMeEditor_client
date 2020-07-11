import React from 'react'

import {Branch, Notes, Main, Navbar} from '@/containers'

import './Base.scss';

export default () => {
  return(
    <>
      <section className='base'>
        <Navbar />
        <div style={{display: 'flex'}}>
          <Branch />
          <Notes />
          <Main />
        </div>
      </section>
      <section className='map'>

      </section>
    </>
  )
}