import React, { useEffect, useState } from "react";
import "./MultiplayerGame.css";
import { useNavigate } from "react-router-dom";

function MultiplayerGameGuest({ socket, friend, roomID }) {
  const navigate = useNavigate();
  const STARTING_NUMBER = 2;
  const [answerGrids, setAnswerGrids] = useState([]);
  const [hitCorrectTiles, setHitCorrectTiles] = useState(0);
  const [level, setLevel] = useState({
    bigLevel: STARTING_NUMBER,
    subLevel: 1,
  }); // max level = 8
  const [moveToNextLevel, setMoveToNextLevel] = useState(false);
  const [disableGrid, setDisableGrid] = useState(false);
  const [opponentFinished, setOpponentFinished] = useState("");
  const [totalScores, setTotalScores] = useState(0);
  const [finishedLevel, setFinishedLevel] = useState(false);
  const [win, setWin] = useState(null); //True means won, false means lost

  const [answerGridFromHost, SetAnswerGridFromHost] = useState([]);
  const [receivedFromHost, setReceivedFromHost] = useState(false);
  const [hostLevel, setHostLevel] = useState({});

  const [opponentTiles, setOpponentTiles] = useState(0);
  const [opponentScores, setOpponentScores] = useState(0);
  //receive the answer grid from the host
  // socket.on("receive_answer_grid", (ans, levelFromHost) => {
  //   console.log("received the answer grid from the host")
  //   setHostLevel(levelFromHost);
  //   SetAnswerGridFromHost(ans);
  //   setFinishedLevel(false);
  // });

  useEffect(() => {
    // Event handler for opponent finished
    const handleReceivedHostGrid = (ans, levelFromHost) => {
      console.log("received the answer grid from the host");
      setHostLevel(levelFromHost);
      SetAnswerGridFromHost(ans);
      setFinishedLevel(false);
    };

    socket.on("receive_answer_grid", handleReceivedHostGrid);

    socket.on("receive_finished", (message) => {
      setOpponentFinished(message);
    });

    socket.on("receive_tiles", (tiles) => {
      setOpponentTiles(tiles);
    });

    socket.on("receive_totalScores", (scores) => {
      setOpponentScores(scores);
    });
    socket.on("someone_lost", (bool) => {
      setWin(true);
    });

    // Clean up
    return () => {
      console.log("Shut down");
      socket.off("receive_answer_grid");
      socket.off("someone_lost");
      socket.off("receive_tiles");
    };
  }, []);

  useEffect(() => {
    console.log("Moving forward");
    handleMoveNextLevelButton();
    setOpponentFinished("");
  }, [hostLevel]);

  ////////////opponent finished

  const generateAnswerGrids = () => {
    let ans = [];
    const total = level.bigLevel * level.bigLevel;
    const numberOfCorrectTiles = Math.ceil(total * 0.5);
    for (let i = 0; i < total; i++) {
      ans.push(i);
    }
    var shuffled = ans.slice(0),
      i = ans.length,
      temp,
      index;
    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    setAnswerGrids(shuffled.slice(0, numberOfCorrectTiles));
  };
  const cleanTiles = () => {
    if (receivedFromHost) {
      const squares = document.querySelectorAll(".grid-square");
      for (let index = 0; index < level.bigLevel * level.bigLevel; index++) {
        if (squares[index].classList.contains("correct")) {
          squares[index].classList.toggle("correct");
        }

        if (squares[index].classList.contains("clicked")) {
          squares[index].classList.toggle("clicked");
        }
      }
    }
  };
  const showAnswers = () => {
    const squares = document.querySelectorAll(".grid-square");
    for (let index = 0; index < level.bigLevel * level.bigLevel; index++) {
      if (answerGrids.includes(index)) {
        squares[index].classList.toggle("correct");
      }
    }
  };
  const handleMoveNextLevelButton = () => {
    setLevel((prev) => {
      if ((prev.subLevel + 1) % 3 == 0) {
        return { bigLevel: prev.bigLevel + 1, subLevel: 1 };
      }
      return { bigLevel: prev.bigLevel, subLevel: prev.subLevel + 1 };
    });

    finishSubLevel();
    setDisableGrid(false);
  };
  const finishSubLevel = () => {
    cleanTiles();
    setHitCorrectTiles(0);
    setMoveToNextLevel(false);
  };

  //when answergrid changes, it means you move to the next level
  useEffect(() => {
    showAnswers();
    setTimeout(cleanTiles, 2000);
    console.log(answerGrids);
  }, [answerGrids]);

  useEffect(() => {
    // generateAnswerGrids()
    setAnswerGrids(answerGridFromHost);
    setReceivedFromHost(true);
  }, [level]);

  /////pass the level
  useEffect(() => {
    socket.emit("tiles", roomID, hitCorrectTiles);

    if (hitCorrectTiles == answerGrids.length && answerGrids.length > 0) {
      setFinishedLevel(true);
      setDisableGrid(true);
      if (opponentFinished == "finished") {
        socket.emit("finished", roomID, "Both");
        console.log("Emitting");
        setOpponentFinished("Done");
      } else if (opponentFinished == "") {
        socket.emit("finished", roomID, "finished");
      }
    }
  }, [hitCorrectTiles]);

  // useEffect(() => {
  //   if (lives == 0){
  //     setDisableGrid(true)
  //     setTimeout(() => {
  //       navigate('/end', {state: {bigLevel: level.bigLevel, subLevel: level.subLevel}})
  //     }, 1500)
  //   }
  // }, [lives])

  useEffect(() => {
    socket.emit("totalScores", roomID, totalScores);

    if (totalScores < 0) {
      socket.emit("lost", roomID, true);
      setWin(false);
    }
  }, [totalScores]);

  const handleSquareClick = (index) => {
    const squares = document.querySelectorAll(".grid-square");
    if (
      !squares[index].classList.contains("correct") &&
      !squares[index].classList.contains("clicked")
    ) {
      if (answerGrids.includes(index)) {
        squares[index].classList.toggle("correct");
        setHitCorrectTiles((prev) => {
          return prev + 1;
        });
        setTotalScores((prev) => {
          return prev + 10;
        });
      } else {
        squares[index].classList.toggle("clicked");

        setTotalScores((prev) => {
          return prev - 15;
        });
      }
    }
  };

  return (
    <>
      {win === true ? (
        <>
          <div className="container">
            {" "}
            <h1>You won!!!</h1>
          </div>
          <div className="container">
            {" "}
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              Go Back main menu
            </button>
          </div>
        </>
      ) : win === false ? (
        <>
          <div className="container">
            {" "}
            <h1>You Lost!!!</h1>
          </div>

          <div className="container">
            {" "}
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              Go Back main menu
            </button>
          </div>
        </>
      ) : (
        <div>
          <div className="container">
            {
              <>
                <h1>Tiles: {hitCorrectTiles}</h1>
                <h1>Scores: {totalScores}</h1>
                <h1>Level:{level.bigLevel}</h1>
                <h1>Sublevel:{level.subLevel}</h1>
                {moveToNextLevel ? (
                  <button onClick={handleMoveNextLevelButton}>Next</button>
                ) : (
                  <></>
                )}
              </>
            }
          </div>

          <div className="container">
            <h1># correct tiles by opponent: {opponentTiles}</h1>
            <h1>opponent scores: {opponentScores}</h1>
          </div>

          {finishedLevel ? (
            <div className="container">
              <h1>You pass this level! Waiting for the host to proceed</h1>
            </div>
          ) : (
            <></>
          )}

          {receivedFromHost ? (
            <div
              className="grid-container"
              style={{ "--grid-size": level.bigLevel }}
            >
              {Array.from({ length: level.bigLevel * level.bigLevel }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="grid-square"
                    onClick={
                      disableGrid ? null : () => handleSquareClick(index)
                    }
                  ></div>
                )
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
}

export default MultiplayerGameGuest;
