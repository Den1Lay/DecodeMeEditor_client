import React, {useState, useRef, useEffect} from 'react';
import classNames from 'classnames';
import { Tag, Upload, message, Select, Tooltip, Popconfirm} from 'antd';

import { InboxOutlined, FileAddOutlined, DeleteOutlined} from '@ant-design/icons';

import {Mentions, Button, BoxImage, ImageTooltip} from '@/components';

import './ArtPart.scss'

const { Option } = Select;

const { CheckableTag } = Tag;
const { Dragger } = Upload;

const ArtPart = (
  {
    value, 
    row, 
    mentionsHandler, 
    fileHandler, 
    artSrc, 
    illustrations, 
    setArtSrc, 
    unsetIllust, 
    setIllust, 
    removeIllust
  }) => {
  // const wrapperRef = useRef(null);
  // const pictureRef = useRef(null)
  const [workPlace, setWorkPlace] = useState('description');
  const [show, setShow] = useState(false)
  // const [sizes, setSizes] = useState({width: 'auto', height: 'auto'})
  // const [workSrc, setWorkSrc] = useState(null)
  // const [restart, setRestart] = useState(true)
  // const [show, setShow] = useState(false)

  debugger

  // Фикс пробликиваний и недорабатывания..
  // useEffect(() => {
  //   // чисто памятник
  //   if(pictureRef.current) {
  //     if(workSrc !== artSrc) {
  //       setWorkSrc(artSrc);
  //       setSizes({width: 'auto', height: 'auto'});
  //       setShow(false);
  //       return
  //     }

  //     const {naturalHeight: pH, naturalWidth: pW} = pictureRef.current;
  //     const {offsetHeight: wH, offsetWidth: wW} = wrapperRef.current;
  //     if(pH === 0 && pW === 0) {
  //       setRestart(!restart)
  //       return
  //     }
  //     if(sizes.width === sizes.height && (pH !== 0 && pW !== 0)) {
  //       if(pW > pH) {
  //         //width 100% 
  //         setSizes({width:'100%', height: 'auto'});
  //       } else {
  //         setSizes({width:'auto', height: '100%'});
  //       }
  //       setShow(true)
  //     }
      

  //   }
  // });


  function chooseFromExist() {
    console.log('CHOOSE_FROM_EXIST');
    setArtSrc(illustrations[0]) // сделать здесь полноценные редактор пикч.
  } 

  return (
    <div className='artPart'>
      <div className='artPart__main'>
        <div className={classNames('artPart__main_description', 'artPart__main_description'+(workPlace==='picture'?'-hide':'-show'))}>
          <Mentions 
            value={value} 
            row={row} 
            placeholder={`Arts description`} 
            changeHandler={mentionsHandler}/> 
        </div>
        <div  className={classNames('artPart__main_picture','artPart__main_picture'+(workPlace==='picture'?'-show':'-hide'))}>
          { typeof artSrc === 'string'
            ? <div className='pictureWrapper'>
                <div className='pictureWrapper__shadow'>
                  <div className='buttonWrapper'>
                    <span className='pictureWrapper__shadow_unset' onClick={unsetIllust}>x</span>
                    <div className='pictureWrapper__shadow_remove'>
                      <Popconfirm placement="rightBottom" title={'Remove this picture'} onConfirm={() => removeIllust(artSrc)} okText="Yes" cancelText="No">
                        <DeleteOutlined style={{color: 'white'}} />
                      </Popconfirm>  
                    </div>
                  </div>
                </div>
                <BoxImage artSrc={artSrc} />
              </div>
            : <div className='artPart__main_picture_inputs'>
                <input style={{display: 'none'}} name='file' type='file' id='file' onChange={fileHandler} />
                <label htmlFor='file'><FileAddOutlined style={{fontSize: '3vh', color: "grey", marginBottom: '1vh', cursor: 'pointer'}} /></label>
                {/* <div className={classNames('artPart__main_picture_inputs_preview', 'artPart__main_picture_inputs_preview'+(show ? '-show' : '-hide'))}>
                  <BoxImage artSrc={artSrc} /> 
                </div> */}
                <Select
                  style={{width: '100%'}}
                  showSearch
                  placeholder="Select illustration"
                  >
                  {illustrations.map(({name, src}) => {
                     return <Option>
                      <div className='illustSelect' > 
                        <div className='illustSelect__actions' onClick={() => setIllust(src)}>
                          {name}
                        </div>
                        {/* <div className={classNames('illustSelect__preview')}>
                          <div style={{width: '100px', height: '100px', backgroundColor: 'green'}}>22</div>
                        </div> */}
                        {/* <ImageTooltip imageBlock={<BoxImage artSrc={src} />}>
                          
                        </ImageTooltip> */}
                         {/* <div style={{width: '100%', height: '100%'}}>
                          <BoxImage artSrc={src} />
                         </div> */}
                         
                      </div>
                      </Option>
                  })}
                  </Select>
                  {/* <Button clickHandler={chooseFromExist}>Choose from exists</Button> */}
              </div>
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