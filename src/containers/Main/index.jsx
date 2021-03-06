import React, {useState, useRef, useEffect} from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames';
import anime from 'animejs'
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import {Button} from '@/components'
import {Editor, Project, Version, Social} from './elements'
import Profile from './Profile'

import {openPlace} from '@/actions'

import './Main.scss';

const Main = ({mainPlace, openPlace}) => {
  // интегрируй роутер
  const [component, setComponent] = useState([{name: null, payload: <div></div>}]);
  debugger
  useEffect(() => {
    if(component[0].name !== mainPlace) {
      let newPayload;
      switch(mainPlace) {
        case 'editor':
          newPayload = (
            <div className={classNames('editor')}>
              <Editor />
            </div>
          )
        break;
        case 'project':
          newPayload = (
            <div className={classNames('project')}>
              <Project isSetup={false} />
            </div>
          )
        break;
        case 'version':
          newPayload = (
            <div className={classNames('version')}>
              <Version />
            </div>
          )
        break;
        case 'setup':
          newPayload = (
            <div className={classNames('project')}> 
              <Project isSetup={true} />
            </div>
          )
        break;
        case 'beginner':
          newPayload = (
            <div className={classNames('beginner')}>
              <Button clickHandler={() => openPlace('project')}>CREATE YOUR FIRST PROJECT</Button> 
            </div>
          )
        break
        case 'social':
          newPayload = (
            <div className={classNames('social')}>
              <Social />
            </div>
          );
        break
        case 'choose':
          newPayload = (
            <div className='choose'>
              Choose project
            </div>
          )
        break
        case 'error':
          newPayload = (
            <div className='error'>
              Project, version or pod was deleted, rechoose project.
            </div>
          )
        break
        case 'profile': 
        newPayload = (
          <div className='profile'>
            <Profile />
          </div>
        )
        break
        default:

      }
      setComponent([{name: mainPlace, payload: newPayload}])
    }
  })

  // Подключить аниме и пробовать делать систему.
  return(
    <div className='main'>
       {/* <TransitionGroup>
          {
            component.map(({name, payload}) => (
              <CSSTransition
                key={name}
                timeout={1500}
                classNames="item"
                >
                {payload}  
              </CSSTransition>
            ))
          }
       </TransitionGroup> */}
       {component[0].payload}
    </div>
  )
}

export default connect(({main: {mainPlace}})=> ({mainPlace}), {openPlace})(Main)

{/* {component.payload}  */}
{/* <div className='main'>
      <div className={classNames('editor', mainPlace === 'editor' ? 'editor-show' : 'editor-hide')}>
        <Editor />
      </div>
      <div className={classNames('project', mainPlace === 'project' ? 'project-show' : 'project-hide')}>
        <Project isSetup={false} />
      </div>
      <div className={classNames('version', mainPlace === 'version' ? 'version-show' : 'version-hide')}>
        <Version />
      </div>
      <div className={classNames('project', mainPlace === 'setup' ? 'setup-show' : 'setup-hide')}> 
        <Project isSetup={true} />
      </div>
      <div className={classNames('beginner', mainPlace === 'beginner' ? 'beginner-show' : 'beginner-hide')}>
        <Button clickHandler={() => openPlace('project')}>CREATE YOUR FIRST PROJECT</Button> 
      </div>
      <div className={classNames('social', mainPlace === 'social' ? 'social-show' : 'social-hide')}>
        <Social />
      </div>
      
    </div> */}