import React from 'react'
import "./EnterLobby.css"
function EnterLobby() {
  return (
    <>
    <div className='container'>
      <div className='heading'>Lobby</div>
    </div>

    <div className='infoContainer'>
      <div className='info'>Name: </div>
      <input type='text' maxLength={30}></input>
    </div>

    </>
  )
}

export default EnterLobby