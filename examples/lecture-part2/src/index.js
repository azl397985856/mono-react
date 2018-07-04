import React from "../../../src/mini-react";
import ReactDOM from "../../../src/mini-react-dom";

// root
const root = document.getElementById("root");

class HelloMessage extends React.Component {
  render({ name }) {
    return React.createElement("div", { name }, `Hello ${name}`);
  }
}

// render to dom

ReactDOM.render(new HelloMessage({ name: "Taylor" }), root);
