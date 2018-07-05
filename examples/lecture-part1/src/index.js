import React from "../../../src/mini-react";
import ReactDOM from "../../../src/mini-react-dom";

// our Elements
const HelloMessage = ({ name }) =>
  React.createElement("div", null, `Hello ${name}`);

// render to dom
ReactDOM.render(
  HelloMessage({ name: "Taylor" }),
  document.getElementById("root")
);
