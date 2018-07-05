import React from "../../../src/mini-react";
import ReactDOM from "../../../src/mini-react-dom";

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: props.count
    };
  }
  handleClick() {
    this.setState({
      count: (this.state.count || 0) + 1
    });
  }
  render({ name }, { count }) {
    return <div onClick={this.handleClick.bind(this)}>Count: {count}</div>;
  }
}

// render to dom
ReactDOM.render(<Counter count={0} />, document.getElementById("root"));
