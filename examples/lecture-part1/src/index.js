import React from "../../../src/mini-react";
import ReactDOM from "../../../src/mini-react-dom";

// root
const root = document.getElementById("root");

// our Elements
const helloWorld = ({ name }) =>
  React.createElement("div", { name: "lucifer" }, `Hello ${name}`);

// render to dom
ReactDOM.render(helloWorld({ name: "lucifer" }), root);
