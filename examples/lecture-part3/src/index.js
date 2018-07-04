import React from "../../../src/mini-react";
import ReactDOM from "../../../src/mini-react-dom";

// root
const root = document.getElementById("root");

class HelloMessage extends React.Component {
  constructor(props) {
    super(props);
  }
  render({ name }) {
    return <div>hello {name}</div>;
  }
}

ReactDOM.render(
  <HelloMessage name="lucifer">
    <div>inner</div>
  </HelloMessage>,
  root
);
