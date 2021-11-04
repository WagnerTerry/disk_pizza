import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Modal from "react-modal";

import "./index.css";

Modal.setAppElement("#root");

ReactDOM.render(<App />, document.getElementById("root"));
