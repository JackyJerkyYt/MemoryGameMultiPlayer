import React, { useEffect, useState } from "react";
import "./Multiplayer.css";
import { io } from "socket.io-client";
import { UNSAFE_getPathContributingMatches } from "@remix-run/router";
import MultiplayerGameHost from "../../components/MultiplayerGameHost";
import MultiplayerGameGuest from "../../components/MultiplayerGameGuest";
import { BACKEND_HOST } from "../../API/api";
const socket = io.connect(BACKEND_HOST);
function Multiplayer() {
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState(false);
  const [roomID, setRoomID] = useState(null);

  ///////join room
  const [itselfJoinRoom, setItSelfJoinRoom] = useState(false);
  const [joinedOthersRoom, setJoinedOthersRoom] = useState(false);
  const [hostAccepted, setHostAccepted] = useState(false);

  //host room
  const [itselfHostRoom, setItselfHostRoom] = useState(false);
  const [hostRoomID, setHostRoomID] = useState(null);
  const [createdHostRoomID, setCreatedHostRoomID] = useState(false);

  const [message, setMessage] = useState("");
  const [receiveMessage, setReceivedMessage] = useState("");

  const [friend, setFriend] = useState(null);
  const [startGame, setStartGame] = useState(false);

  const handleSetMessage = (event) => {
    setMessage(event.target.value);
  };

  const submitMessage = () => {
    console.log("Current Room", createdHostRoomID);
    socket.emit("send-message", message, roomID);
  };

  socket.on("connect", () => {
    console.log("You connected with id:", socket.id);
    setRoomID(socket.id);
  });

  socket.on("receive-message", (data) => {
    setReceivedMessage(data);
    console.log("received message!!!!", createdHostRoomID);
  });
  

  if (itselfHostRoom) {
    socket.on("user_joined", (name) => {
      console.log("Someone Joined Your Room!!!!");
      setFriend(name);
    });
  }

  if (itselfJoinRoom) {
    socket.on("host_started", (hostName) => {
      setFriend(hostName);
      setStartGame(true);
    });
  }

  const handleNameInput = (event) => {
    event.preventDefault();
    console.log("Hello1!!");
    setName(event.target.value);
  };

  const submitName = () => {
    if (name != "") {
      setSubmittedName(true);
    }
  };

  const handleSetRoomID = (event) => {
    setRoomID(event.target.value);
  };

  const handleJoinRoomButton = () => {
    setJoinedOthersRoom(true);
    socket.emit("join_room", roomID, name);
  };

  const handleCreateHostRoomIDButton = () => {
    setCreatedHostRoomID(true);
    socket.emit("join_room", hostRoomID, name);
  };

  const handleHostRoomID = (event) => {
    setHostRoomID(event.target.value);
    setRoomID(event.target.value);
  };

  const handleStartGame = () => {
    setStartGame(true);
    socket.emit("start_game", name, roomID);
  };
  return (
    <>
      {startGame ? (
        itselfHostRoom ? 
        <MultiplayerGameHost socket={socket} friend={friend} roomID={roomID}/>
        :
        <MultiplayerGameGuest socket={socket} friend={friend} roomID={roomID}/>
      ) : (
        <>
          <div className="container">
            <div className="heading">Lobby</div>
          </div>

          {itselfHostRoom || itselfJoinRoom ? (
            itselfHostRoom ? (
              <>
                {createdHostRoomID ? (
                  <>
                    <div className="infoContainer">
                      <div className="info">
                        Share Room ID To Your Friend: {hostRoomID}
                      </div>
                    </div>
                    {friend ? (
                      <>
                        <div className="infoContainer">
                          <div className="info">
                            This is your opponent: {friend}
                          </div>
                        </div>
                        <div className="infoContainer">
                          <button onClick={handleStartGame}>Start Game</button>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <div className="infoContainer">
                    <div className="info">Create Room ID: </div>
                    <input
                      onChange={handleHostRoomID}
                      type="text"
                      maxLength={50}
                    ></input>
                    <button onClick={handleCreateHostRoomIDButton}>
                      Create
                    </button>
                  </div>
                )}

                <div className="infoContainer">
                  <div className="info">Message: </div>
                  <input
                    onChange={handleSetMessage}
                    type="text"
                    maxLength={50}
                  ></input>
                  <button onClick={submitMessage}>Submit</button>

                  <div>{receiveMessage}</div>
                </div>
              </>
            ) : (
              <>
                <div className="infoContainer">
                  <div className="info">Enter Room ID: </div>
                  <input
                    onChange={handleSetRoomID}
                    type="text"
                    maxLength={50}
                  ></input>
                  <button onClick={handleJoinRoomButton}>Submit</button>
                </div>

                {!friend && joinedOthersRoom ? (
                  <div className="infoContainer">
                    <div className="info">wait for the host to accept</div>
                  </div>
                ) : (
                  <div className="infoContainer">
                    <div className="info">This is your opponent: {friend}</div>
                  </div>
                )}

                <div className="infoContainer">
                  <div className="info">Message: </div>
                  <input
                    onChange={handleSetMessage}
                    type="text"
                    maxLength={50}
                  ></input>
                  <button onClick={submitMessage}>Submit</button>
                  <div>{receiveMessage}</div>
                </div>
              </>
            )
          ) : submittedName ? (
            <>
              <div className="container">
                <div className="info">Name: {name}</div>
              </div>

              <div className="container">
                <button
                  onClick={() => {
                    setItSelfJoinRoom(true);
                  }}
                >
                  Join Room
                </button>
                <button
                  onClick={() => {
                    setItselfHostRoom(true);
                  }}
                >
                  Host Room
                </button>
              </div>
            </>
          ) : (
            <div className="infoContainer">
              <div className="info">Name: </div>
              <input
                onChange={handleNameInput}
                type="text"
                maxLength={30}
              ></input>
              <button onClick={submitName}>Submit</button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Multiplayer;
