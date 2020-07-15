import React from 'react'
import {connect} from 'react-redux'
import classNames from 'classnames';

import {Editor, Project, Version} from './elements'

import './Main.scss';

const Main = ({mainPlace}) => {
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
    </div>
  )
}

export default connect(({main: {mainPlace}})=> ({mainPlace}))(Main)