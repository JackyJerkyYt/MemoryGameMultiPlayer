import React from 'react'
import "./landing.css"
function Landing() {
  const host = window.location.hostname
  return (
    <>
    <div className='container'>
      <div className='heading'>Are You a Gold Fish ?</div>
    </div>

    <div className='container'>
      <button onClick={() => {
        window.location.href = `/game`
      }}>Single Play</button>
    </div>

    <div className='container'>
      <button onClick={() => {
        window.location.href = `/multiplayer`
      }}>Multiplayer</button>
    </div>
    </>
  )
}

export default Landing