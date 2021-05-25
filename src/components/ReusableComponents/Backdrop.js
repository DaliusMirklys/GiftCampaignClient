import React from 'react'

const Backdrop = props => {
   return (props.active ? <div className='Backdrop' onClick={props.onclick}></div> : null)
}
 
export default Backdrop