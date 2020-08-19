import React from 'react'
import {connect} from 'react-redux'
import {socket} from '@/core'

import {Button} from '@/components'

import {logOut} from '@/actions'

import './Profile.scss'

const Profile = ({logOut}) => {

  function logoutHandler () {
    socket.emit('LOGOUT', {token: localStorage.token});
    logOut()
  }

  return (
    <div className='profile'>
      <div className='profile__firstLine'>
        <div className='profile__firstLine_space'>
        </div>
        <div className='profile__firstLine_btn'>
          <Button clickHandler={logoutHandler}>LOGOUT</Button>
        </div>
      </div>
    </div>
  )
}

export default connect(() => ({}), {logOut})(Profile)