import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {socket} from '@/core'
import store from '@/store'

import {Input, Button, AddToCompadre} from '@/components';
import {Select} from 'antd'
import {openNotification, mineInd} from '@/utils'

import {choosePerson, updateUsers, previewPerson, cleanApplicantList, updateData, changeMaster} from '@/actions'

const {Option} = Select

const Social = (
  {
    friends, 
    superId, 
    choosePerson, 
    applicantList, 
    cleanApplicantList, 
    updateData, 
    changeMaster,
    workPerson, 
    previewPerson, 
    updateUsers
  }) => {
  debugger
  // возможность работать с челом в зависимости от доступов с его стороны...
  const [person, setPerson] = useState(null);
  const [personDetail, setPersonDetail] = useState(null);
  const [users, setUsers] = useState(null);
  const [newComrade, setNewComrade] = useState([]);

  let isFriend = person ? person.friends.some(({superId:personId}) => personId === superId) : null;

  useEffect(() => {
    if(users === null) {
      socket.emit('GET_USERS', {token: localStorage.token});
      socket.on('NEW_USERS', ({users: newUsers}) => setUsers(newUsers))
    }
    if(person && !isFriend && (!personDetail || (personDetail.userData.superId !== person.superId))) {
      socket.emit('GET_USERS_DETAIL', {token: localStorage.token, personId: person.superId});
      socket.on('NEW_USERS_DETAIL', ({user}) => {
        console.log("MAIN_SOCIAL_EVENT")
        setPersonDetail(user)
      })
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
        console.log(`ALlenght: ${applicantList.length} newComrade.length: ${newComrade.length}`)
        setNewComrade(comrades)
      })
    };
    return function() {
      debugger
      // по фа

      const {main: {mainPlace, workPerson, personObj: {userData: {superId}}}} = store.getState();
      if(person && superId === workPerson && mainPlace !== 'social') {
        socket.emit('UNSUBSCRIBE_USER', {token: localStorage.token, personId: person.superId});
      }

    }
  })

  function onSelectUser(nickName) {
    let userInd = [];
    mineInd(users, nickName, 'nickName', userInd);

    setPerson(users[userInd[0]])
  };
  function onSelectFriend(nickName) {
    // ИНТЕГРИРУЙ сюда луп, который будет получать FRESH данные и сразу же обновлять.
    // нет нет. При клике происходит подъем последних данных и подписывание на ВСЕ изменения. Не нужны лупы.
    let friendInd = []; 
    mineInd(friends, nickName, ['userData', 'nickName'], friendInd);
    
    socket.emit('SUBSCRIBE_USER', {
      token: localStorage.token, 
      personId: friends[friendInd[0]].userData.superId
    });
    socket.on('NEW_SUBSCRIBE_USER', ({friendObj}) => {
      updateData({data: friendObj, address: 'friend'});
      setPerson(friendObj.userData)
    })
  };

  function onSendRequest() {
    socket.emit('FRIEND_REQUEST', {token: localStorage.token, person})
  };

  let availableProjects = personDetail && personDetail.projects.filter( ({access}) => access.includes(superId) || access.includes('all') )

  function chooseHandler() {
    if(availableProjects.length && isFriend) {

      // Это делается, потому что этот чел мог что то настроить за время раздумий, а я спецем 
      // не обрабатывал эти вызовы.. (причина в необходимости перестраивать пол редюсера) так что 
      // дополнительный запрос;
      socket.emit('SUBSCRIBE_USER', {
        token: localStorage.token, 
        personId: personDetail.userData.superId
      });
      socket.on('NEW_SUBSCRIBE_USER', ({friendObj}) => {
        changeMaster(false);
        updateData({data: friendObj, address: 'friend'});
        choosePerson(person.superId);
      })


 
      //!isFriend && previewPerson(personDetail);
    } else {
      openNotification({type: 'warning', message: 'Restriction', description: 'The user must have at least one project'})
    }
  };
  function addCompadreHandl(superId) {
    socket.emit('ACCEPT_REQUEST', {token:localStorage.token, personId: superId});
    cleanApplicantList(superId);
    setNewComrade(newComrade.filter(({superId:personId}) => personId !== superId ));
  }

  let postData = new FormData();

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
                  <Button clickHandler={() => {chooseHandler()}}>Choose profile</Button>
                </div> 
              }
              
              { 
                !isFriend && 
                <div className='social__chusedUser_addToFriend'>
                  <Button clickHandler={onSendRequest}>Add to comrades</Button>
                </div>
              }
              <div className='social__chusedUser_projectCount'>
                {personDetail && `Count of available projects: ${availableProjects.length}`}
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

export default connect(({main: {friends, personObj: {userData: {superId, applicantList}}, accessV, workPerson, friendV}}) => ({
  friends, superId, applicantList, L: applicantList.length, fL: friends.length, workPerson, accessV, friendV
}), 
{choosePerson, updateUsers, previewPerson, cleanApplicantList, updateData, changeMaster})(Social)