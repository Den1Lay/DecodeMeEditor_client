import React, {useState, useRef, useEffect} from 'react';
import classNames from 'classnames';
import { Tag, Upload, message } from 'antd';

import { InboxOutlined } from '@ant-design/icons';

import {Mentions} from '@/components';

import './ArtPart.scss'

const { CheckableTag } = Tag;
const { Dragger } = Upload;

const ArtPart = ({value, row, mentionsHandler, fileHandler, artSrc}) => {
  const wrapperRef = useRef(null);
  const pictureRef = useRef(null)
  const [workPlace, setWorkPlace] = useState('description');
  const [sizes, setSizes] = useState({width: 'auto', height: 'auto'})
  const [restart, setRestart] = useState(true)

  debugger
  useEffect(() => {

    if(pictureRef.current) {

      const {naturalHeight: pH, naturalWidth: pW} = pictureRef.current;
      const {offsetHeight: wH, offsetWidth: wW} = wrapperRef.current;
      if(pH === 0 && pW === 0) {
        setRestart(false)
        return
      }
      if(sizes.width === sizes.height && (pH !== 0 && pW !== 0)) {
        if((wW/wH) < (pW/pH)) {
          //width 100% 
          setSizes({width:'100%', height: 'auto'});
        } else {
          setSizes({width:'auto', height: '100%'});
        }
      }
      

    }
  })
  return (
    <div className='artPart'>
      <div ref={wrapperRef} className='artPart__main'>
        <div className={classNames('artPart__main_description', 'artPart__main_description'+(workPlace==='picture'?'-hide':'-show'))}>
          <Mentions 
            value={value} 
            row={row} 
            placeholder={`Arts description`} 
            changeHandler={mentionsHandler}/> 
        </div>
        <div  className={classNames('artPart__main_picture','artPart__main_picture'+(workPlace==='picture'?'-show':'-hide'))}>
          { typeof artSrc === 'string'
            ? <img ref={pictureRef} width={sizes.width} height={sizes.height} src={artSrc} />
            : <input type='file' onChange={fileHandler} />
          }
        </div>
      </div>
      <div className='artPart__controllers'>
        <CheckableTag
          checked={workPlace === 'description'}
          onClick={() => workPlace !== 'description' && setWorkPlace('description')}
        >
          Description
        </CheckableTag>
        <CheckableTag
          checked={workPlace === 'picture'}
          onClick={() => workPlace === 'description' && setWorkPlace('picture')}
        >
          Picture
        </CheckableTag>
      </div>
    </div>
  )
}

export default ArtPart