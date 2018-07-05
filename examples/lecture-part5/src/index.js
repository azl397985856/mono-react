import React from "../../../src/mini-react";
import ReactDOM from "../../../src/mini-react-dom";

class LifeCycleDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
    console.log("constructor with props: ", props);
  }
  shouldComponentUpdate(props, state) {
    console.log(
      "shouldComponentUpdate with",
      "next props: ",
      props,
      "currentProps:",
      this.props,
      "nextState:",
      state,
      "currentState:",
      this.state
    );
    return true;
  }
  getDerivedStateFromProps(props, state) {
    console.log(
      "getDerivedStateFromProps with props: ",
      props,
      "state:",
      state
    );
    return {
      name: props.name
    };
  }
  getSnapshotBeforeUpdate(props, state) {
    console.log("getSnapshotBeforeUpdate with props: ", props, "state:", state);
  }
  componentDidUpdate(props, state, snapshot) {
    console.log(
      "componentDidUpdate with props: ",
      props,
      "state:",
      state,
      "snapshot:",
      snapshot
    );
  }
  componentDidMount() {
    console.log("componentDidMount");
  }
  componentWillUnmount() {
    console.log("componentWillUnmount");
  }
  // render函数和react的render略有不同
  // 这里借鉴了preact的思想，将props和state通过参数传到render函数中去
  render(props, state) {
    console.log("render with props: ", props, "render with state:", state);
    return (
      <div>
        Hello {props.name}
        <div>
          count: {state.count}
          <button
            onClick={() =>
              this.setState({
                count: this.state.count + 1
              })
            }
          >
            setState
          </button>
        </div>
      </div>
    );
  }
}

// render to dom
ReactDOM.render(
  <LifeCycleDemo name="Taylor" />,
  document.getElementById("root")
);
