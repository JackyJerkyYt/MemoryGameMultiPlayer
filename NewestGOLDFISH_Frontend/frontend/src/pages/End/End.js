import React, { useState } from 'react'
import {useLocation} from 'react-router-dom';
import "./end.css"
import { SUBMIT_SCORE_URL } from '../../API/api';
import axios from "axios"

function End() {
  const location = useLocation();
  const level = location.state.bigLevel
  const subLevel = location.state.subLevel
  const totalScore = level * 10 + subLevel*3
  const [namee, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const handleUserName = (event) => {
    setName(event.target.value)
  }

  const submitHandler = async(event) => {
    event.preventDefault()
    const scoreData = {
      username: namee,
      score: `${totalScore}`,
        }  
        axios.post(SUBMIT_SCORE_URL, scoreData)
          .then(() => {
              setSubmitted(true)
          })
          .catch(
              (err) => {
                alert("OOP something went wrong!")
              })

  }

  return (
    <>
    <div className='container'>
      <div className='heading'>Submit Your Score</div>
    </div>

    {
      submitted ?
      <>
        <div className='scoresContainer'>
          <div className='scores'>You Just Submitted Your Score</div>
        </div>
        <div className='container'>
          <button onClick={() => {
            window.location.href = `/`
          }}>GO Back</button>
        </div>
      </>
      :
      <>
        <div className='scoresContainer'>
          <div className='scores'>Level: {level}</div>
        </div>

        <div className='scoresContainer'>
          <div className='scores'>sub-level: {subLevel}</div>
        </div>

        <div className='scoresContainer'>
          <div className='scores'>Total: {totalScore}</div>
        </div>

        
        <div className='infoContainer'>
          <div className='info'>Name: </div>
          <input onChange={handleUserName} type='text' maxLength={30}></input>
        </div>
        <div className='container'>
          <button onClick={() => {
            window.location.href = `/`
          }}>Forget It</button>
          <button onClick={submitHandler}>Submit</button>
        </div>
      </>
    }
    </>
  )
}

export default End