import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {socket} from '@/core'

import {Input, Button, AddToCompadre} from '@/components';
import {Select} from 'antd'

import {choosePerson, updateUsers, previewPerson, cleanApplicantList} from '@/actions'

const {Option} = Select

const Social = ({friends, superId, choosePerson, applicantList, cleanApplicantList, previewPerson, updateUsers}) => {
  debugger
  const [person, setPerson] = useState(null);
  const [personDetail, setPersonDetail] = useState(null);
  const [users, setUsers] = useState(null);
  const [newComrade, setNewComrade] = useState([])

  let isFriend = person ? person.friends.some(({superId:personId}) => personId === superId) : null;

  useEffect(() => {
    if(users === null) {
      socket.emit('GET_USERS', {token: localStorage.token});
      socket.on('NEW_USERS', ({users: newUsers}) => setUsers(newUsers))
    }
    if(person && !isFriend && (!personDetail || (personDetail.userData.superId !== person.superId))) {
      socket.emit('GET_USERS_DETAIL', {token: localStorage.token, personId: person.superId});
      socket.on('NEW_USERS_DETAIL', ({user}) => setPersonDetail(user))
    } else if(person && (!personDetail || (personDetail.userData.superId !== person.superId))) {
      //is Friend
      let friendInd;
      for(let i in friends) {
        if(friends[i].userData.superId === person.superId) {
          friendInd = i;
        }
      }
      setPersonDetail(friends[friendInd]);
    };
    if(applicantList.length !== newComrade.length) {
      socket.emit('GET_COMRADE_DETAIL', {token: localStorage.token});
      socket.on('NEW_COMRADE_DETAIL', ({comrades}) => {
        setNewComrade(comrades)
      })
    }
  })

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
    debugger
    if(personDetail.projects != false) {
      isFriend && choosePerson(person.superId);
      //!isFriend && previewPerson(personDetail);
    }
  };
  function addCompadreHandl(superId) {
    socket.emit('ACCEPT_REQUEST', {token:localStorage.token, personId: superId});
    cleanApplicantList(superId);
    setNewComrade(newComrade.filter(({superId:personId}) => personId !== superId ))
  }

  let personDetailIsLoaded = personDetail && (personDetail.userData.superId === person.superId);
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
                isFriend &&
                <div className='social__chusedUser_chuseProfile'>
                  <Button clickHandler={() => chooseHandler()}>Choose profile</Button>
                </div> 
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
      <div className='social__requestToFriend'>
        {
          newComrade.length
          ? <div className='social__requestToFriend_list'>
              {newComrade.map(({nickName, src, projectCount, superId}) => {
                return <AddToCompadre onAdd={addCompadreHandl} nickName={nickName} src={src} projectCount={projectCount} superId={superId} />
              })}
            </div>
          : <div className='social__requestToFriend_plug'>
              No requests
            </div>
        }
      </div>
    </>
  )
}

export default connect(({main: {friends, personObj: {userData: {superId, applicantList}}}}) => ({friends, superId, applicantList, L: applicantList.length }), 
{choosePerson, updateUsers, previewPerson, cleanApplicantList})(Social)