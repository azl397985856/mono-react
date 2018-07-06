import React from "../src/mini-react";
import ReactDOM from "../src/mini-react-dom";

describe("mini-react", () => {
  it("render", () => {
    const root = document.createElement("div");
    const helloWorld = React.createElement("div", null, `Hello World`);
    ReactDOM.render(helloWorld, root);
    expect(root.innerHTML).toContain("<div>Hello World</div>");
  });

  it("support jsx", () => {
    const root = document.createElement("div");
    class HelloMessage extends React.Component {
      // render函数和react的render略有不同
      // 这里借鉴了preact的思想，将props和state通过参数传到render函数中去
      render({ name }) {
        return <div>Hello {name}</div>;
      }
    }

    // render to dom
    ReactDOM.render(<HelloMessage name="Taylor" />, root);

    expect(root.innerHTML).toContain("<div>Hello Taylor</div>");
  });
});
