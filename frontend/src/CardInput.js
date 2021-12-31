import React, { useRef } from "react";

function setWord(idx, setCards) {
  return function (e) {
    const value = e.target.value;

    setCards((prev) => {
      const curr = [...prev];
      curr[idx].word = value;
      return curr;
    });
  };
}

function deleteCard(idx, setCards) {
  return function () {
    setCards((prev) => {
      return prev.filter((_, index) => index !== idx);
    });
  };
}

function prohibitedHandlers(idx, setCards) {
  function add() {
    setCards((prev) => {
      if (prev[idx].prohibited.length == 7) {
        alert("You can only have 7 prohibited words");
        return prev;
      }

      // So that the object pointer changes triggering a rerender
      const curr = [...prev];

      curr[idx].prohibited.push("");
      return curr;
    });
  }

  function remove(i) {
    setCards((prev) => {
      if (prev[idx].prohibited.length == 4) {
        alert("You have to have at least 4 prohibited words");
        return prev;
      }

      // So that the object pointer changes triggering a rerender
      const curr = [...prev];

      curr[idx].prohibited = curr[idx].prohibited.filter((_, j) => i !== j);
      return curr;
    });
  }

  function change(e, i) {
    const value = e.target.value;

    setCards((prev) => {
      // So that the object pointer changes triggering a rerender
      const curr = [...prev];

      curr[idx].prohibited[i] = value;
      return curr;
    });
  }

  return [add, remove, change];
}

export default function CardInput({ cards, setCards, idx }) {
  const prohibitedH = useRef(prohibitedHandlers(idx, setCards));
  const [addP, delP, changeP] = prohibitedH.current;

  const { word, prohibited, color: cardColor } = cards[idx];

  return (
    <div className="card">
      <div className="header" style={{ backgroundColor: cardColor }}>
        <input
          type="text"
          value={word}
          onChange={setWord(idx, setCards)}
          placeholder="word"
        />
      </div>
      <div>
        <ul>
          {prohibited.map((word, i) => (
            <li key={i}>
              <input
                value={word}
                onChange={(e) => changeP(e, i)}
                placeholder={`prohibited word ${i + 1}`}
              />
              <button onClick={() => delP(i)}>x</button>
            </li>
          ))}
        </ul>
        <button onClick={addP}>Add prohibited word</button>
      </div>
      <button onClick={deleteCard(idx, setCards)}>Delete card</button>
    </div>
  );
}
