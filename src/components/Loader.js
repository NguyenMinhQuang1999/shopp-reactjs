import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loader = () => {
  return (
    <Spinner
    animation="border" variant="primary"
    role="status"

    style={{
        width: "100px",
        height: "100px",
        margin: "auto",
        display: "block",
        color: "blue"
    }}
    >
        <span className='sr-only'>Loading...</span>

    </Spinner>
  )
}

export default Loader