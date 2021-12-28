import React, { useEffect, useState } from "react";
import "./App.css";
import { useTimer } from "react-timer-hook";
import useCards from "./cardsHook";
import { useLocation } from "react-router-dom";

function getColor() {
  return (
    "hsl(" +
    360 * Math.random() +
    "," +
    (25 + 70 * Math.random()) +
    "%," +
    (85 + 10 * Math.random()) +
    "%)"
  );
}

function Game() {
  const {
    state: { selected, seconds: secondsIn, numberOfTeams },
  } = useLocation();

  // Current round, how many times every team has played
  const [round, setRound] = useState(0);

  // Current turn, indicates which team it's turn it is
  const [turn, setTurn] = useState(0);

  // Keep track of points, each index is a team
  const [points, setPoints] = useState(Array(numberOfTeams).fill(0));

  // Game state. either "running" "inbetween"
  const [gameState, setgameState] = useState("inbetween");

  const [cardColor, setCardColor] = useState("rgb(228, 88, 53)");

  const [getCard, currentCard] = useCards(selected);

  const time = new Date();
  time.setSeconds(time.getSeconds() + secondsIn);
  const { seconds, minutes, pause, restart } = useTimer({
    expiryTimestamp: time,
    autoStart: false,
    onExpire: () => toInbeetween(false),
  });

  // Called to transition from "inbetween"->"running"
  function gameStep() {
    getCard();

    const time = new Date();
    time.setSeconds(time.getSeconds() + secondsIn);
    restart(time, true);

    setgameState("running");
  }

  // Called to transition from "running"->"inbetween"
  function toInbeetween() {
    pause(); //Pause clock
    setgameState("inbetween");
    setCardColor(getColor()); //New card color for the card

    // Increase round/turn accordingly
    if (turn + 1 == numberOfTeams) {
      setTurn(0);
      setRound((r) => r + 1);
    } else {
      setTurn((t) => t + 1);
    }
  }

  function increasePointAndNewCard() {
    setPoints((prev) => {
      const newPoints = [...prev];
      newPoints[turn]++;
      return newPoints;
    });

    getCard();
  }

  return (
    <div>
      <p>points {points.map((p, i) => `${i + 1}:${p}`).join(" | ")}</p>

      {gameState == "inbetween" && (
        <>
          <p>round: {round + 1}</p>
          <p>You're up, Team {turn + 1}</p>
          <button onClick={gameStep}>next</button>
        </>
      )}

      {gameState == "running" && (
        <div className="card">
          <div className="header" style={{ backgroundColor: cardColor }}>
            <p className="time">
              {minutes}minutes {seconds}seconds
            </p>
            <p>{currentCard.word}</p>
          </div>
          <div>
            <ul>
              {currentCard.prohibited.map((word) => (
                <li>{word}</li>
              ))}
            </ul>
          </div>
          <div className="buttons">
            <button onClick={increasePointAndNewCard} className="right">
              right
            </button>
            <button onClick={getCard} className="wrong">
              wrong
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
