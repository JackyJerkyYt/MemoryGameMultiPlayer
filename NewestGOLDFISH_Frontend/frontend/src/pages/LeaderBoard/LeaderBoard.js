import React, { useEffect, useState } from "react";
import axios from "axios";
import { RETRIEVE_SCORE_URL } from "../../API/api";
import "./LeaderBoard.css"; // Import your custom CSS for styling

function LeaderBoard() {
  const [topScorers, setTopScorers] = useState([]);

  useEffect(() => {
    axios
      .get(RETRIEVE_SCORE_URL)
      .then((res) => {
        setTopScorers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="container">
        <div className="heading">Top Scorers</div>
      </div>
      <div className="container">
        <table className="content-table">
          <thead>
            <tr>
              <th>name</th>
              <th>score</th>
            </tr>
          </thead>

          {topScorers.map((user, index) => {
            return (
              <tbody>
                <tr>
                  <td>{user.username} </td>
                  <td>{user.score}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </>
  );
}

export default LeaderBoard;
