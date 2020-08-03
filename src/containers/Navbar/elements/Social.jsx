import React from 'react'
import {connect} from 'react-redux'

import {Button} from '@/components'

import {openPlace} from '@/actions'

const Navbar_Social = ({personObj, openPlace}) => {
  // function socialClickHandl(ev) {
  //   ev.persist();
  //   console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  // }

  return (
    <div className='navbar__social'>
      <div className='navbar__social_fastAccess'>
        Fast access place...
      </div>
      <div className='navbar__social_details'>
        <Button place='navbar' clickHandler={() => openPlace('social')}>
          Details
        </Button>
      </div>
      <div className='navbar__social_me'>
        {
          personObj && (
            personObj.src 
            ? <div className='navbar__social_me_avatar'>
                <img src="" alt=""/>
              </div>
            : <div className='navbar__social_me_avatar_alt' onClick={() => console.log('I_CLICK')}>
              I
            </div>
          )
        }
      </div>
    </div>
  )
}

export default connect(({main: {friends, personObj}}) => ({friends, personObj}), {openPlace})(Navbar_Social);