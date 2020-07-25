// докинь нормальных анимация перехода с логина на рп
import React from 'react'
import {connect} from 'react-redux'
import {socket} from '@/core';

import {Branch, Notes, Main, Navbar, Map, Login} from '@/containers'

import './Base.scss';

const Base = ({projects}) => {
  console.log('DEBUG', projects)

  return(
    <>
      {
        projects 
      ?
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
      :
        <section className='auth'>
          <Login />
        </section>
      }
    </>
  )
}

export default connect(({main: {projects}}) => ({projects}), {})(Base)