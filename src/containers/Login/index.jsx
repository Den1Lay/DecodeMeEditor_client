import React, {useRef, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import {fetchUserData, userLogin, autoLoginWithToken} from '@/actions'

import {Button} from '@/components';

import './Login.scss'

const Login = ({fetchUserData, userLogin, autoLoginWithToken}) => {
  const login = useRef(null)
  const [show, setShow] = useState(true)

  useEffect(() => {
    // login.current.addEventListener('transitionend', () => {
    //   console.log('Transition end')
    // })
    // 
    debugger
    localStorage.token && autoLoginWithToken()
  })

  function loginHandl() {

    //fetchUserData()
    const {nickName, password} = localStorage
    let fakeData = {nickName, password};
    console.log(fakeData)
    userLogin(fakeData)
    setShow(!show)
  }

  return(
    <div ref={login} className={classNames('login', show ? 'login-show' : 'login-hide')}>
      <Button clickHandler={loginHandl}>
        LOGIN
      </Button>
    </div>
  )
}

export default connect(({}) => ({}), {fetchUserData, userLogin, autoLoginWithToken})(Login)
