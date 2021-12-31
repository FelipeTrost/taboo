import React, { useState } from "react";

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

export default function Collection({ collection, onClick }) {
  const [color1, _] = useState(getColor());
  const [color2, __] = useState(getColor());
  return (
    <div className="card-collection" onClick={onClick}>
      {[color1, color2].map((c) => (
        <div className="card">
          <div className="header" style={{ backgroundColor: c }}>
            <p className="time">{collection.name}</p>
          </div>
          {collection.description && <p>{collection.description}</p>}
          {collection.keywords.length !== 0 && (
            <p>Keywords: {collection.keywords.join(", ")}</p>
          )}
          <p>Language: {collection.language}</p>
        </div>
      ))}
    </div>
  );
}
