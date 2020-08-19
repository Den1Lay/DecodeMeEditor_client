import React, {useRef, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import {fetchUserData, userLogin, autoLoginWithToken, createUser} from '@/actions'

import {Button, CheckTags, Input} from '@/components';
import {Form, message} from 'antd'

import './Login.scss'

const Login = ({fetchUserData, userLogin, autoLoginWithToken, createUser}) => {
  const login = useRef(null),
  [showAchtung, setShowAchtung] = useState(true),
  [show, setShow] = useState(null),
  [workPlace, setWorkPlace] = useState('create'),
  [data, setData] = useState({nickName: '', password: '', secondPassword: ''}),
  {nickName, password, secondPassword} = data;

  const AT = ({children, src}) => {

    return <span 
      onMouseEnter={() => setShow(src)} 
      onMouseLeave={() => setShow(null)}
      className='activeText'>{children}
      </span>
  }

  useEffect(() => {
    console.log('SHOW:', show)
    // сделать приколюху с видимостью Логина;
    // здесь запускается автоматический входе, если есть токен.
    localStorage.token && autoLoginWithToken()
  })

  function submitHandl(ev) {
    ev.preventDefault();
    let errors = false;
    if(password.length < 3) {
      errors = true;
      message.error('Password too short')
    };
    if (nickName.length < 3) {
      errors = true;
      message.error('NickName too short')
    }

    if(workPlace === 'create') {
      
      if (password !== secondPassword) {
        errors = true;  
        message.error('Passwords are not equal')
      } 
      !errors && createUser(data)
    } else {
      !errors && userLogin(data);
    }
    //fetchUserData()
    // const {nickName, password} = localStorage;
    // let fakeData = {nickName, password};
    // console.log(fakeData)
    //setShow(!show)
  }

  let checkTagsProps = {
    firstVal: 'LOGIN',  
    firstHandler: () => setWorkPlace('login'), 
    secondVal: 'CREATE NEW', 
    secondHandler:() => setWorkPlace('create'), 
    checkData: workPlace === 'login'
  }

 const prefix = 'http://localhost:4040/uploads/';
  return( // show ? 'login-show' : 'login-hide'
    <div ref={login} className={classNames('login')}>
      {
        show &&
        <div className='help'>
          <img  src={prefix+show} />
        </div>
      }

      <div className='login__header'>
        <div className='login__header_main'>
          {"DecodeMe"}
        </div>
        <div className='login__header_dls'>
          {"Editor (alpha)"}
        </div>
      </div>

      <div className='achtung'>
        <div className='achtung__header'>
          <h1>Achtung! </h1>
          <div className='achtung__header_help'>Зеленый текст интерактивен.</div>
        </div>
        <div className='achtung__payload'>
        {"В случае возникновения проблем прошу сохранять спокойствие,  "}
        <AT src={'devtools.png'}>открыть инструменты разработчика</AT> 
        {" и выбрать"} <AT src={'console.png'}>вкладку с консолью.</AT> 
        {" После чего написать в консоль: "}
        <AT src={'code.png'}>{`window.sendErrors("Любой ваш комментарий.
        Главное что бы он был в ковычках")`}</AT>{` Как только 
        закончите вводить нажмите Enter.
        Самое время испытать себя в роли разработчика). Меня всегда можно найти `}
        <a target="_blank" className='me' href='https://vk.com/es_ilias'>здесь</a>.
 
        </div>
      </div>
      <div className='login__main'>
        <CheckTags {...checkTagsProps}/>
        <form onSubmit={submitHandl}>
          <div className={classNames('form')}>
              <Input 
                placeholder={'Nickname'} 
                changeHandler={ev => {ev.persist(); setData({...data, nickName: ev.target.value})}} 
                value={nickName} />
            </div>
            <div className={classNames('form', 'form__password')}>
              <Input
                isPassword={true}
                placeholder={'Password'} 
                changeHandler={ev => {ev.persist(); setData({...data, password: ev.target.value})}} 
                value={password} />
            </div>
            {
              workPlace === 'create' && 
              <div className={classNames('form', 'form__password')}>
                <Input
                isPassword={true}
                placeholder={'Password confirm'} 
                changeHandler={ev => {ev.persist(); setData({...data, secondPassword: ev.target.value})}} 
                value={secondPassword} />
              </div>
            }
            <div className='login__main_submit'>
              <Button clickHandler={submitHandl} htmlType="submit">
                SEND DATA
              </Button>
            </div>
        </form>
        
      </div>
      
    </div>
  )
}

export default connect(({}) => ({}), 
{fetchUserData, userLogin, autoLoginWithToken, createUser})(Login)
