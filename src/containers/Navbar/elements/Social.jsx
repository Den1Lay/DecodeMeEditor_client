import React from 'react'

import {NavbarInput, NavbarButton} from '@/components'

const Navbar_Social = () => {
  function socialClickHandl(ev) {
    ev.persist();
    console.log('%c%s', 'color: blue; font-size: 12px;', 'EV:', ev)
  }

  return (
    <div className='navbar__social'>
        <NavbarButton
            simbol={"Socials"}
            clickHandler={socialClickHandl}
            width={97}/>
      </div>
  )
}

export default Navbar_Social;