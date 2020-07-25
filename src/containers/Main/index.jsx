import React from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames';

import {Button} from '@/components'
import {Editor, Project, Version} from './elements'

import {opedProjectCreator} from '@/actions'

import './Main.scss';

const Main = ({mainPlace, opedProjectCreator}) => {
  //debugger
  return(
    <div className='main'>
      <div className={classNames('editor', mainPlace === 'editor' ? 'editor-show' : 'editor-hide')}>
        <Editor />
      </div>
      <div className={classNames('project', mainPlace === 'project' ? 'project-show' : 'project-hide')}>
        <Project />
      </div>
      <div className={classNames('version', mainPlace === 'version' ? 'version-show' : 'version-hide')}>
        <Version />
      </div>
      <div className={classNames('beginner', mainPlace === 'beginner' ? 'beginner-show' : 'beginner-hide')}>
        <Button clickHandler={() => opedProjectCreator()}>CREATE YOUR FIRST PROJECT</Button> 
      </div>
    </div>
  )
}

export default connect(({main: {mainPlace}})=> ({mainPlace}), {opedProjectCreator})(Main)