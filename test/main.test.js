import React from "../src/mini-react";
import ReactDOM from "../src/mini-react-dom";

describe("mini-react", () => {
  it("render", () => {
    const root = document.createElement("div");
    const helloWorld = React.createElement("div", null, `Hello World`);
    ReactDOM.render(helloWorld, root);
    expect(root.innerHTML).toContain("<div>Hello World</div>");
  });

  it("support function", () => {
    const root = document.createElement("div");
    const helloWorld = ({ name }) =>
      React.createElement("div", { name: "lucifer" }, `Hello ${name}`);
    ReactDOM.render(helloWorld({ name: "lucifer" }), root);

    expect(root.innerHTML).toContain("<div>Hello lucifer</div>");
  });
});
