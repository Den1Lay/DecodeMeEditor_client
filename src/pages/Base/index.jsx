// докинь нормальных анимация перехода с логина на рп
import React, { useState, useEffect, Suspense }  from 'react'
import {connect} from 'react-redux'
import {socket} from '@/core';

import {Button} from '@/components'
import {Branch, Notes, Navbar, Map, Main, Login} from '@/containers' //Login as DefLogin

import './Base.scss';
//const isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iPad|od|hone)/i.test(navigator.userAgent);
//const Login = React.lazy(() => import('@/containers/Login'));
const Base = ({projects, mainPlace}) => {
   //const [login, setLogin] = useState({setted: false, payload: null});
   const [showLazy, setShowLazy] = useState(false);
  // console.log('DEBUG', projects) //<Login />
  // const isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);
  
  // useEffect(() => {
  //   let saveProject = JSON.stringify(Login);
  //   console.log('STRINGIFY_LOGIN:', saveProject)
  //   if(!login.setted) {
  //     if(!isMobile) {
  //       setLogin({payload: <Suspense fallback={<p></p>}><Login /></Suspense>, setted: true});
  //     } else {

  //     }
  //   }
  // })
    // return(
    //   <>
    //     {
    //       showLazy 
    //       ? <Suspense fallback={null}><Login /></Suspense>
    //       : <div>PLUG</div>
    //     }
    //     <Button clickHandler={() => setShowLazy(!showLazy)}>Change</Button>
    //   </>
    // )
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
                {
                  mainPlace === 'map'
                  ? <Map />
                  : <>
                      <Suspense fallback={null}><Main /></Suspense>
                      <Notes />
                    </>
                }
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

export default connect(({main: {projects, mainPlace}}) => ({projects, mainPlace}), {})(Base)