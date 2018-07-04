import React from "../../../src/mini-react";
import ReactDOM from "../../../src/mini-react-dom";

// root
const root = document.getElementById("root");

class HelloMessage extends React.Component {
  render({ name }) {
    return React.createElement("div", null, `Hello ${name}`);
  }
}

ReactDOM.render(
  React.createElement(
    HelloMessage,
    { name: "lucifer" },
    React.createElement(HelloMessage, { name: "Taylor" })
  ),
  root
);
