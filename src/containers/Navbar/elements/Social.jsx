import React from 'react'
import {connect} from 'react-redux'

import {Button} from '@/components'

import {openPlace, chooseMe} from '@/actions'

const Navbar_Social = ({personObj, openPlace, chooseMe}) => {
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
      <div className='navbar__social_me' onClick={chooseMe}>
        {
          personObj && (
            personObj.src 
            ? <div className='navbar__social_me_avatar'>
                <img src="" alt=""/>
              </div>
            : <div className='navbar__social_me_avatar_alt'>
              I
            </div>
          )
        }
      </div>
    </div>
  )
}

export default connect(({main: {friends, personObj}}) => ({friends, personObj}), {openPlace, chooseMe})(Navbar_Social);