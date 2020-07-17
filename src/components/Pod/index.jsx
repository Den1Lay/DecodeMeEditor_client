import React from 'react'
import classNames from 'classnames'

import {PlusOutlined, DeleteOutlined} from '@ant-design/icons'

import './Pod.scss';

const Pod = ({actived, label, height}) => {
  return(
    <div className={classNames('pod', actived && 'pod-actived')}>
      <div className='pod__top'>
        <div className='pod__top_height'>
          {height}
        </div>
        <div className='pod__top_btns'>
          <div className='pod__top_btns_plus' onClick={()=> console.log('PLUS_CLICK')}>
            <PlusOutlined />
          </div>
          <div className='pod__top_btns_delete' onClick={()=> console.log('DELETE_CLICK')}>
            <DeleteOutlined />
          </div>
        </div>
      </div>
      <div className='pod__content'>
        {label.slice(0, 40)}
      </div>
    </div>
  )
}

export default Pod