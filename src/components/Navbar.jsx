import React from 'react'
import dayjs from 'dayjs'
import { navLinks,navIcons } from '#constants'
const Navbar = () => {
  return (
    <nav>
        <div>
      <img src="/images/logo.svg" alt="logo"/>
      <p className='font-bold'>Rudrajyoti's Portfolio</p>
      <ul>
        {navLinks.map(({id,name})=>(
        <li key={id}>
            <p>{name}</p>
            </li>
            ))}
      </ul>
    
    </div>
    <ul>
        {navIcons.map(({id,img})=>(
        <li key={id}>
            <img src={img} className='icon-hovers' alt={`icon-${id}`}/>
            </li>
            ))}
      </ul>
      <time>{dayjs().format("ddd MMM D h:mm A")}</time>
    <div>

    </div>
    </nav>
    
  )
}

export default Navbar
