import React from 'react'
import classNames from 'classnames'

import {Mentions} from 'antd'
import {PlusOutlined, DeleteOutlined} from '@ant-design/icons'

import './Pod.scss';

const Pod = ({actived, label, readOnly, height, onPlus, onDelete, onChoose, showDelete, onAction}) => {
  
  function deleteHandl(ev) {
    ev.stopPropagation()
    showDelete && onDelete(height)
  }
  
  return(
  <div className={classNames('pod', actived ? 'pod-actived' : 'pod-just')} onClick={() => onChoose(height)}>
      <div className='pod__top'>
        <div className='pod__top_height'>
          {height}
        </div>
        {
          !readOnly && 
          <div className='pod__top_btns'>
            <div 
              className={classNames('pod__top_btns_delete', showDelete ? 'pod__top_btns_delete-show' : 'pod__top_btns_delete-hide')} 
              onClick={(ev) => {ev.stopPropagation(); deleteHandl(ev); onAction()}}>
              <DeleteOutlined />
            </div>
            <div className='pod__top_btns_plus' onClick={(ev)=> {ev.stopPropagation();onPlus(height); onAction()}}>
              <PlusOutlined />
            </div>
          </div>
        }
      </div>
      <div className={classNames('pod__bottom',actived ? 'pod__bottom-actived' : 'pod__bottom-just')}>
        <Mentions value={label.slice(0, 45)} readOnly rows={2} />
      </div>
    </div>
  )
}

export default Pod