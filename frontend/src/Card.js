import React from "react";

export default function Card({
  cardColor,
  minutes,
  seconds,
  card,
  increasePointAndNewCard,
  getCard,
}) {
  return (
    <div className="card">
      <div className="header" style={{ backgroundColor: cardColor }}>
        <p className="time">
          {minutes}minutes {seconds}seconds
        </p>
        <p>{card.word}</p>
      </div>
      <div>
        <ul>
          {card.prohibited.map((word) => (
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
  );
}
