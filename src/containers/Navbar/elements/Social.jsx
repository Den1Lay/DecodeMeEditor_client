// Компонент отвечает за возвращение домой, причем, с поднятием новых данных о проектах,
// Если кто-то что-то поменял пока владельца не было дома.

// Так же здесь будут кнопки для быстрого доступа к проектам друзей

import React from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames'
import {socket} from '@/core'
import {openNotification} from '@/utils'

import {Button} from '@/components'

import {openPlace, chooseMe, updateData, choosePerson, changeMaster} from '@/actions'

const Navbar_Social = (
  {
  personObj, 
  workPerson,
  friends, 
  openPlace, 
  chooseMe, 
  updateData, 
  choosePerson, 
  changeMaster
}) => {


  function chooseMeHanler() {
    let mySuperId = personObj.userData.superId;
    if(workPerson !== mySuperId) {
      socket.emit('GET_USERS_DETAIL', {token: localStorage.token, personId: mySuperId});
      socket.on('NEW_USERS_DETAIL', ({user}) => {
        if(user.userData.superId === mySuperId) { // возможно эта проверка не нужна
          chooseMe(user.projects)
        }
      })
    } else {
      openPlace('profile')
    }
    //
  }

  function chooseFriendHandler(personId) {
    socket.emit('SUBSCRIBE_USER', {
      token: localStorage.token, 
      personId
    });
    socket.on('NEW_SUBSCRIBE_USER', ({friendObj}) => {
      const me = personObj.userData.superId;
      if(friendObj.projects.some(({access}) => access.includes(me) || access.includes('all'))) {
        changeMaster(false);
        updateData({data: friendObj, address: 'friend'});
        choosePerson(personId);
      } else {
        openNotification({type: 'error', message: 'Error', description:"Friend don't provide accesses"})
      }
      
    })
  }

  const avatarComp = (person, alt, me=false) => person.userData.src 
    ? <div className='avatar'><img src="" alt=""/></div>
    : <div className={classNames('avatar_alt',me && 'avatar_alt_me')}> {alt} </div>


  return (
    <div className='navbar__social'>
      <div className='navbar__social_fastAccess'>
        {
          friends.length
          ? <div className='friendsList'> 
            {friends.slice(0, 2).map((friend) => { /// WTF Если сюда поставить splice то он модифнет state.main. Ору
              debugger
              return <div onClick={() => chooseFriendHandler(friend.userData.superId)}>
                {avatarComp(friend, friend.userData.nickName.substring(0, 2))}
              </div>
            })}
            </div>
          : 'Fast access place...'
        }
        
      </div>
      <div className='navbar__social_details'>
        <Button place='navbar' clickHandler={() => openPlace('social')}>
          Details
        </Button>
      </div>
      <div className='navbar__social_me' onClick={chooseMeHanler}>
        {
          personObj && avatarComp(personObj, 'I', true)
        }
      </div>
    </div>
  )
}

export default connect(({main: {friends, personObj, workPerson}}) => ({friends, personObj, workPerson}), 
  {openPlace, chooseMe, updateData, choosePerson, changeMaster})(Navbar_Social);