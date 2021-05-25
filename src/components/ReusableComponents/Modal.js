import React from 'react'
import Backdrop from './Backdrop'

const Modal = props => {
    return (
        <React.Fragment>
            <Backdrop active={true} onclick={props.close}/>
            <div className='Modal'>
                {props.children}
            </div>
        </React.Fragment>
    )
}
 
export default Modal