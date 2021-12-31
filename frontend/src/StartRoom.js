import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";
import Collection from "./Collection";

export default function StartRoom() {
  const navigate = useNavigate();

  const [text, setText] = useState("");

  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [seconds, setSeconds] = useState(60);

  const [value] = useDebounce(text, 400);

  const [selected, setSelected] = useState({});
  const [collections, setCollections] = useState([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  // To avoid triggering page useEffect after changing the search value
  const valueSearch = useRef(false);

  async function getCollections(pageEnum) {
    const params = new URLSearchParams();
    params.set("query", value);
    params.set("page", pageEnum);

    const res = await fetch(
      `${
        process.env.REACT_APP_SERVER_URL
      }/api/cards/search?${params.toString()}`
    );

    const {
      success,
      message: { collections, numPages },
    } = await res.json();

    if (success) {
      setCollections(collections);
      setPageCount(numPages);
      setPage(pageEnum);
    }
  }

  useEffect(() => {
    valueSearch.current = true;
    getCollections(0);
  }, [value]);

  useEffect(() => {
    if (valueSearch.current) valueSearch.current = false;
    else getCollections(page);
  }, [page]);

  return (
    <div>
      <div className="container grey">
        <input
          type="text"
          placeholder="Search decks"
          className="search"
          value={text}
          style={{ margin: 16 }}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="container">
        <h2>Room settings</h2>
        <div>
          <label for="numberOfTeams">Number of teams</label>
          <input
            type="number"
            value={numberOfTeams}
            id="numberOfTeams"
            onChange={(e) => setNumberOfTeams(+e.target.value)}
            min={2}
            max={10}
          />
        </div>

        <div>
          <label for="seconds">Seconds</label>
          <input
            type="number"
            value={seconds}
            id="seconds"
            onChange={(e) => setSeconds(+e.target.value)}
            min={10}
            max={120}
          />
        </div>

        <button
          onClick={() => {
            if (Object.keys(selected).length == 0)
              alert("you need to select at least one collection");
            else
              navigate("/game", {
                state: { selected, seconds, numberOfTeams },
              });
          }}
        >
          Start room
        </button>

        <h3>Selected decks:</h3>

        <ul>
          {Object.keys(selected).map((s) => (
            <li key={s}>
              {selected[s].name}
              <button
                onClick={() =>
                  setSelected((prev) => {
                    prev = { ...prev };
                    delete prev[s];
                    return prev;
                  })
                }
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="container grey">
        <h2>Collections:</h2>
        <div className="collection-squared">
          {collections.map((coll) => (
            <Collection
              collection={coll}
              key={coll._id}
              onClick={() =>
                setSelected((prev) => ({ ...prev, [coll._id]: coll }))
              }
            />
          ))}
        </div>
      </div>

      <div>
        <p>Page</p>
        {Array(pageCount)
          .fill()
          .map((_, idx) => (
            <>
              <input
                type="checkbox"
                name="page"
                id={`page-${idx}`}
                checked={idx === page}
                onClick={() => setPage(idx)}
              />
              <label for={`page-${idx}`}>{idx + 1}</label>
            </>
          ))}
      </div>
    </div>
  );
}
