import React, {useState, useEffect, useRef} from 'react'

import './BoxImage.scss'

const BoxImage = ({artSrc, clickHandler=()=>{}}) => {
  const wrapperRef = useRef(null);
  const pictureRef = useRef(null)
  const [sizes, setSizes] = useState({width: 'auto', height: 'auto'});
  const [workSrc, setWorkSrc] = useState(null);
  const [restart, setRestart] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // чисто памятник
    debugger
    if(pictureRef.current) {
      if(workSrc !== artSrc) {
        setWorkSrc(artSrc);
        setSizes({width: 'auto', height: 'auto'});
        setShow(false);
        return
      }

      const {naturalHeight: pH, naturalWidth: pW} = pictureRef.current;
      const {offsetHeight: wH, offsetWidth: wW} = wrapperRef.current;
      if(pH === 0 && pW === 0) {
        setRestart(!restart)
        return
      }
      if(sizes.width === sizes.height && (pH !== 0 && pW !== 0)) {
        if(pW/pH > wW/wH) {
          //width 100% 
          setSizes({width:'100%', height: 'auto'});
        } else {
          setSizes({width:'auto', height: '100%'});
        }
        setShow(true)
      }
      

    }
  });

  return <div ref={wrapperRef} className='boxImage' onClick={clickHandler} >
    <img style={{opacity: show ? 1 : 0}} ref={pictureRef} width={sizes.width} height={sizes.height} src={workSrc} />
  </div>
}

export default BoxImage;