import React, {useRef, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import {fetchUserData, userLogin} from '@/actions'

import {Button} from '@/components';

import './Login.scss'

const Login = ({fetchUserData, userLogin}) => {
  const login = useRef(null)
  const [show, setShow] = useState(true)

  useEffect(() => {
    login.current.addEventListener('transitionend', () => {
      console.log('Transition end')
    })
  })

  function loginHandl() {

    //fetchUserData()
    let fakeData = {
      nickName: 'Es_ILias',
      password: '17'
    }
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

export default connect(({}) => ({}), {fetchUserData, userLogin})(Login)