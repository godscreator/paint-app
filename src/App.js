import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import { ConstraintLayout } from "react-constraint-layout";
import Whiteboard from "./whiteboard.js";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <div className="App">
        <div id="topbar">
          <strong>Whiteboard</strong>
        </div>

        <div id="whiteboard">
          <Whiteboard />
        </div>
    </div>
  );
}
