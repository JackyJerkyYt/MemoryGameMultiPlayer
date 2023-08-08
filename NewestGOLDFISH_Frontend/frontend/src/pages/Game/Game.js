import React, { useEffect, useState } from 'react';
import './game.css';
import {useNavigate} from 'react-router-dom';
function Game() {
  const navigate = useNavigate();
  const STARTING_NUMBER = 3
  const LIVES = 2
  const [answerGrids, setAnswerGrids] = useState([])
  const [scores, setScores] = useState(0)
  const [lives, setLives] = useState(LIVES)
  const [level, setLevel] = useState({bigLevel: STARTING_NUMBER, subLevel: 1})    // max level = 8
  const [moveToNextLevel, setMoveToNextLevel] = useState(false)
  const [disableGrid, setDisableGrid] = useState(false)

  const generateAnswerGrids = () => {
    let ans = []
    const total = level.bigLevel * level.bigLevel
    const numberOfCorrectTiles = Math.ceil(total * 0.5)
    for (let i = 0; i < total; i++){
      ans.push(i)
    }
    var shuffled = ans.slice(0), i = ans.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    setAnswerGrids(shuffled.slice(0, numberOfCorrectTiles));

  }
  const cleanTiles = () => {
    const squares = document.querySelectorAll('.grid-square');
    for (let index = 0; index < level.bigLevel * level.bigLevel; index++){
      if (squares[index].classList.contains("correct")){
        squares[index].classList.toggle('correct')
      }

      if (squares[index].classList.contains("clicked")){
        squares[index].classList.toggle('clicked')
      }
    }
  }
  const showAnswers = () => {
    const squares = document.querySelectorAll('.grid-square');
    for (let index = 0; index < level.bigLevel * level.bigLevel; index++){
      if (answerGrids.includes(index)){
        squares[index].classList.toggle('correct')
      }
    }
  }
  const handleMoveNextLevelButton = () => {
    setLevel((prev) => {
      if ((prev.subLevel + 1) % 3 == 0){
        return {bigLevel: prev.bigLevel + 1, subLevel: 1}
      }
      return {bigLevel: prev.bigLevel, subLevel: prev.subLevel + 1}
    })
    finishSubLevel()
    setDisableGrid(false)
  }
  const finishSubLevel = () => {
    cleanTiles()
    setScores(0)
    setLives(LIVES)
    setMoveToNextLevel(false)
  }

  //when answergrid changes, it means you move to the next level
  useEffect(() => {
    showAnswers()
    setTimeout(cleanTiles, 2000)
    console.log(answerGrids)
  }, [answerGrids])

  useEffect(() => {
    generateAnswerGrids()
  }, [level])
 
  /////pass the level
  useEffect(() => {
    if (scores == answerGrids.length && answerGrids.length > 0){
      setMoveToNextLevel(true)
      setDisableGrid(true)
    }
  }, [scores])
 
  useEffect(() => {
    if (lives == 0){
      setDisableGrid(true)
      setTimeout(() => {
        navigate('/end', {state: {bigLevel: level.bigLevel, subLevel: level.subLevel}})
      }, 1500)
    }
  }, [lives])
  const handleSquareClick = (index) => {
    const squares = document.querySelectorAll('.grid-square');
    if (!squares[index].classList.contains("correct") && !squares[index].classList.contains("clicked")){
      if (answerGrids.includes(index)){
        squares[index].classList.toggle('correct');
        setScores((prev) => {
          return prev + 1
        })
      }else{
        squares[index].classList.toggle('clicked');
        setLives((prev) => {
          return prev - 1
        })
      }
    } 
  };

  return (
    <div>
      {/* <input
        type="number"
        value={level}
        onChange={handleInputChange}
        min="3"
      /> */}
      <div className='container'>
        {
          lives == 0 ?
          <h1>You Lost</h1> :
            <>
              <h1>Tiles: {scores}</h1>
              <h1>Level:{level.bigLevel}</h1>
              <h1>Sublevel:{level.subLevel}</h1>
              <h1>Lives: {lives}</h1>
              { moveToNextLevel ?
                <button onClick={handleMoveNextLevelButton}>Next</button> :
                <></>
              }
            </>
        }
        
      </div>
      <div className="grid-container" style={{ '--grid-size': level.bigLevel }}>
        {Array.from({ length: level.bigLevel * level.bigLevel }).map((_, index) => (
          <div
            key={index}
            className="grid-square"
            onClick={disableGrid ? null : () => handleSquareClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Game; 
