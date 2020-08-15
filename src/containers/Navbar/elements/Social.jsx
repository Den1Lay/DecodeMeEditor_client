// Компонент отвечает за возвращение домой, причем, с поднятием новых данных о проектах,
// Если кто-то что-то поменял пока владельца не было дома.

// Так же здесь будут кнопки для быстрого доступа к проектам друзей

import React from 'react'
import {connect} from 'react-redux'
import {socket} from '@/core'

import {Button} from '@/components'

import {openPlace, chooseMe} from '@/actions'

const Navbar_Social = ({personObj, openPlace, chooseMe}) => {


  function chooseMeHanler() {
    let mySuperId = personObj.userData.superId;
    socket.emit('GET_USERS_DETAIL', {token: localStorage.token, personId: mySuperId});
    socket.on('NEW_USERS_DETAIL', ({user}) => {
      console.log('HOME_USER:', user);
      if(user.userData.superId === mySuperId) { // возможно эта проверка не нужна
        chooseMe(user.projects)
      }
    })
    //
  }


  return (
    <div className='navbar__social'>
      <div className='navbar__social_fastAccess'>
        Fast access place...
      </div>
      <div className='navbar__social_details'>
        <Button place='navbar' clickHandler={() => openPlace('social')}>
          Details
        </Button>
      </div>
      <div className='navbar__social_me' onClick={chooseMeHanler}>
        {
          personObj && (
            personObj.userData.src 
            ? <div className='navbar__social_me_avatar'>
                <img src="" alt=""/>
              </div>
            : <div className='navbar__social_me_avatar_alt'>
              I
            </div>
          )
        }
      </div>
    </div>
  )
}

export default connect(({main: {friends, personObj}}) => ({friends, personObj}), {openPlace, chooseMe})(Navbar_Social);