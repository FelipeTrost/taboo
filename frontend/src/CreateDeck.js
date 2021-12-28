import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <div>
        <label for="name">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
        />
      </div>

      <div>
        <label for="description">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          id="description"
        />
      </div>

      <div>
        <label for="name">Keywords</label>
        {keywords.map((keyword, idx) => (
          <div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setIndex(setKeywords, idx, e.target.value)}
              id="name"
            />
          </div>
        ))}
        <button onClick={() => setKeywords((curr) => [...curr, "new keyword"])}>
          add keyword
        </button>
      </div>

      <div>
        <label for="name">Cards</label>
        {cards.map((card, idx) => (
          <div
            style={{
              border: "1px solid black",
              padding: 10,
              margin: 10,
            }}
          >
            <input
              type="text"
              value={card.word}
              onChange={(e) => setIndex(setCards, idx, e.target.value)}
              id="name"
            />
            <ul>
              {card.prohibited.map((prohibited, idxp) => (
                <li>
                  <input
                    type="text"
                    value={prohibited}
                    onChange={(e) =>
                      setCards((curr) => {
                        curr = [...curr];
                        curr[idx].prohibited[idxp] = e.target.value;
                        return curr;
                      })
                    }
                  />
                  <button
                    onClick={() =>
                      setCards((curr) => {
                        curr = copy(curr);
                        curr[idx].prohibited = curr[idx].prohibited.filter(
                          (_, i) => i !== idxp
                        );
                        return curr;
                      })
                    }
                  >
                    delete
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() =>
                setCards((curr) => {
                  curr = copy(curr);
                  curr[idx].prohibited.push("prohibited word");
                  return curr;
                })
              }
            >
              add prohibited word
            </button>

            <button
              onClick={() =>
                setCards((curr) => curr.filter((_, i) => i !== idx))
              }
            >
              delete
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            setCards((curr) => [...curr, { word: "", prohibited: [] }])
          }
        >
          add card
        </button>
      </div>

      <br />
      <button onClick={uploadCollection}>Upload collection</button>
    </div>
  );
}

export default CreateDeck;
