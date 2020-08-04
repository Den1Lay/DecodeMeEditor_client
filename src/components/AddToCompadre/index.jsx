import React from 'react'
import {Button} from '@/components'

import './AddToCompadre.scss'

const AddToCompadre = ({nickName, src, projectCount, onAdd, superId}) => {
  return (
    <div className='addTC'>
      {
          src
          ? <div className='addTC__avatar'>
              <img src={src} alt=""/>
            </div>
          : <div className='addTC__avatar_plug'>
              {nickName.substring(0, 2)}
            </div>
      }
      <div className='addTC__data'>
        <div className='addTC__data_nickName'>{nickName}</div>
        <div className='addTC__data_projectCount'>{`Projects: ${projectCount}`}</div>
      </div>
      <div>
        <Button clickHandler={() => onAdd(superId)}>Accept</Button>
      </div>
    </div>
  )
}

export default AddToCompadre;