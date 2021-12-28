import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import CreateDeck from "./CreateDeck";
import StartRoom from "./StartRoom";
import Welcome from "./Welcome";
import Game from "./Game";

function App() {
  return (
    <div className="App">
      {/* <h1>Welcome to React Router!</h1> */}
      <Routes>
        <Route path="/start" element={<StartRoom />} />
        <Route path="/create" element={<CreateDeck />} />
        <Route path="/game" element={<Game />} />
        <Route path="/" element={<Welcome />} />
      </Routes>
    </div>
  );
}

export default App;
