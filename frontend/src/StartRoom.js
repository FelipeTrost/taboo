import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useNavigate } from "react-router-dom";

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
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div>
        <label for="numberOfTeams">No. o. teams</label>
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
            navigate("/game", { state: { selected, seconds, numberOfTeams } });
        }}
      >
        go
      </button>

      {Object.keys(selected)
        .map((s) => selected[s].name)
        .join(", ")}

      <ul>
        {collections.map((coll) => (
          <li>
            <div
              onClick={() =>
                setSelected((current) => ({ ...current, [coll._id]: coll }))
              }
              style={{
                border: "1px solid black",
              }}
            >
              <p>{coll.name}</p>
              <p>{coll.description}</p>
              <p>Keywords: {coll.keywords.join(", ")}</p>
            </div>
          </li>
        ))}
      </ul>

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
  );
}
