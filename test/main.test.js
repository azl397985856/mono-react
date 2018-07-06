import React from "../src/mini-react";
import ReactDOM from "../src/mini-react-dom";

afterEach(() => {
  window.vdom = null;
  window.el = null;
});
describe("mini-react", () => {
  it("render", () => {
    const root = document.createElement("div");
    const helloWorld = React.createElement("div", null, `Hello World`);
    ReactDOM.render(helloWorld, root);
    expect(root.innerHTML).toContain("<div>Hello World</div>");
  });

  it("support state", () => {
    const root = document.createElement("div");
    // 否则document.getElementById("mono-react")获取不到节点
    document.body.appendChild(root);
    class Counter extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          count: 0
        };
      }
      handleClick() {
        this.setState({
          count: this.state.count + 1
        });
      }
      render({ name }, { count }) {
        return (
          <div id="mono-react" onClick={this.handleClick.bind(this)}>
            Count: {count}
          </div>
        );
      }
    }

    // render to dom
    ReactDOM.render(<Counter count={0} />, root);
    // 模拟三次点击
    document.getElementById("mono-react").click();
    document.getElementById("mono-react").click();
    document.getElementById("mono-react").click();

    expect(root.innerHTML).toContain("Count: 3");
  });
});
