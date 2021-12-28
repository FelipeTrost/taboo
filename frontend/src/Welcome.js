import React from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div>
      <Link to="create">Create deck</Link>
      <br />
      <Link to="start">Start game</Link>
    </div>
  );
}
