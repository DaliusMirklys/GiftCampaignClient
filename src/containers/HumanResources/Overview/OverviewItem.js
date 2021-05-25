import React from 'react'

const OverviewItem = props => (
        <div className='Overview item'>
            <h2>{props.title}:</h2>
            <h1>{props.value}</h1>
            {props.children}
        </div>
)
 
export default OverviewItem