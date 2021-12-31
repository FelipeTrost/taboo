import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardInput from "./CardInput";
import getColor from "./getColor";

function copy(o) {
  let out, v, key;
  out = Array.isArray(o) ? [] : {};
  for (key in o) {
    v = o[key];
    out[key] = typeof v === "object" && v !== null ? copy(v) : v;
  }
  return out;
}

function setIndex(action, idx, word) {
  action((curr) => {
    curr = [...curr];
    curr[idx] = word;
    return curr;
  });
}

function CreateDeck() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [cards, setCards] = useState([]);

  const navigate = useNavigate();

  async function uploadCollection() {
    let response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/cards`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          keywords,
          cards,
        }),
      }
    );

    const { success, message } = await response.json();

    if (success) {
      // setName("");
      // setDescription("");
      // setKeywords([]);
      // setCards([]);
      alert("Success!");
      navigate("/");
    } else {
      alert(`Error: ${message}`);
    }
  }

  return (
    <div className="container grey">
      <h1>Create card deck</h1>
      {/* Name */}
      <div>
        <label for="name">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
        />
      </div>

      {/* Description */}
      <div>
        <label for="description">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="description"
        />
      </div>

      {/* Keywords */}
      <div>
        <p>Keywords</p>
        <ul>
          {keywords.map((keyword, idx) => (
            <li key={idx}>
              <input
                type="text"
                placeholder="keyword"
                value={keyword}
                onChange={(e) => setIndex(setKeywords, idx, e.target.value)}
                id="name"
              />
              <button
                onClick={() =>
                  setKeywords((kwrds) => kwrds.filter((_, i) => i !== idx))
                }
              >
                x
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => setKeywords((curr) => [...curr, ""])}>
          add keyword
        </button>
      </div>

      {/* Cards */}
      <div>
        <label for="name">Cards</label>

        <div className="collection-squared">
          {cards.map((_, idx) => (
            <CardInput cards={cards} setCards={setCards} idx={idx} />
          ))}
        </div>

        <button
          onClick={() =>
            setCards((curr) => [
              ...curr,
              { word: "", prohibited: ["", "", "", ""], color: getColor() },
            ])
          }
        >
          add card
        </button>
      </div>

      <br />
      <button onClick={uploadCollection}>Upload deck</button>
    </div>
  );
}

export default CreateDeck;
