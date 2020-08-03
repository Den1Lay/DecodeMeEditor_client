import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {socket} from '@/core'

import {Input, Button} from '@/components';
import {Select} from 'antd'

import {choosePerson, updateUsers, previewPerson} from '@/actions'

const {Option} = Select

const Social = ({friends, superId, choosePerson, previewPerson, updateUsers}) => {
  debugger
  const [person, setPerson] = useState(null);
  const [personDetail, setPersonDetail] = useState(null);
  const [users, setUsers] = useState(null);

  let isFriend = person ? person.friends.includes(superId) : null;

  // useEffect(() => {
  //   if(users === null) {
  //     socket.emit('GET_USERS', {token: localStorage.token});
  //     socket.on('NEW_USERS', ({users: newUsers}) => setUsers(newUsers))
  //   }
  //   if(person && !isFriend && (!personDetail || (personDetail.userData.superId !== person.superId))) {
  //     socket.emit('GET_USERS_DETAIL', {token: localStorage.token, personId: person.superId});
  //     socket.on('NEW_USERS_DETAIL', ({user}) => setPersonDetail(user))
  //   } else if(person && (!personDetail || (personDetail.userData.superId !== person.superId))) {
  //     //is Friend
  //     let friendInd;
  //     for(let i in friends) {
  //       if(friends[i].userData.superId === person.superId) {
  //         friendInd = i;
  //       }
  //     }
  //     setPersonDetail(friends[friendInd]);
  //   }
  // })

  function onSelectUser(nickName) {
    let userInd;
    for(let i in users) {
      if(users[i].nickName === nickName) {
        userInd = i;
      }
    };
    setPerson(users[userInd])
  };

  function onSelectFriend(nickName) {
    let friendInd; 
    for(let i in friends) {
      if(friends[i].userData.nickName === nickName) {
        friendInd = i;
      }
    }
    setPerson(friends[friendInd].userData);
  };

  function onSendRequest() {
    socket.emit('FRIEND_REQUEST', {token: localStorage.token, person})
  };

  function chooseHandler() {
    if(personDetail.projects != false) {
      isFriend && choosePerson(person.superId);
      !isFriend && previewPerson(personDetail);
    }
  }
  let personDetailIsLoaded = personDetail && (personDetail.userData.superId === person.superId);

  const chooseBtn = (
    <div className='social__chusedUser_chuseProfile'>
      <Button clickHandler={chooseHandler}> {isFriend ? "Choose profile" : "Preview profile"}</Button>
    </div> 
  );
  
  return (
    <>
      <div className='social__chusedUser'>
        {
          person 
          ? <div className='social__chusedUser--WRAPPER'>
              <div className='social__chusedUser_showProfile'>
                {
                  setPerson.src
                  ? <div className='social__chusedUser_showProfile_avatar'>
                      <img src={setPerson.src} alt=""/>
                    </div>
                  : <div className='social__chusedUser_showProfile_avatar_plug'>
                      {person.nickName.substring(0, 2)}
                    </div>
                }
              </div>
              {
                isFriend 
                ? chooseBtn
                : personDetailIsLoaded && chooseBtn
              }
              { 
                !isFriend && 
                <div className='social__chusedUser_addToFriend'>
                  <Button clickHandler={onSendRequest}>Add to comrades</Button>
                </div>
              }
              <div className='social__chusedUser_projectCount'>
                {personDetail && `Count of projects: ${personDetail.projects.length}`}
              </div>
            </div>
          : <div className='social__chusedUser_plug'>
            Selected person
          </div>
        }
      </div>
      {
        users &&  <div className='social__findUser'>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Users"
          onSelect={onSelectUser}
        >
          {
           users.map(({nickName}) => <Option value={nickName}>{nickName}</Option>)
          }
      
        </Select>
      </div>
      }
      <div className='social__findFriend'>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Friends"
          onSelect={onSelectFriend}
        >
          {
           friends.length && friends.map(({userData: {nickName}}) => <Option value={nickName}>{nickName}</Option>)
          }
        </Select>
      </div>
    </>
  )
}

export default connect(({main: {friends, personObj: {userData: {superId}}}}) => ({friends, superId}), {choosePerson, updateUsers, previewPerson})(Social)