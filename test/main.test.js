import React from "../src/mini-react";
import ReactDOM from "../src/mini-react-dom";

const firstRender = ReactDOM.__get__("firstRender");
const subsquentedRender = ReactDOM.__get__("subsquentedRender");

class LifeCycleDemo extends React.Component.default {}

describe("mini-react", () => {
  it("render", () => {
    const root = document.createElement("div");
    const helloWorld = React.createElement("div", null, `Hello World`);
    ReactDOM.render(helloWorld, root);
    expect(root.innerHTML).toContain("<div>Hello World</div>");
  });

  it("support lifecycle:挂载阶段", () => {
    const initialProps = {
      name: "Taylor"
    };
    const state = {
      count: 5
    };
    const instance = new LifeCycleDemo(initialProps);

    instance.getDerivedStateFromProps = jest.fn();

    instance.render = jest.fn();

    instance.componentDidMount = jest.fn();

    firstRender(initialProps, state, instance);

    expect(instance.getDerivedStateFromProps).toBeCalledWith(
      initialProps,
      state
    );

    expect(instance.render).toBeCalledWith(initialProps, state);

    expect(instance.componentDidMount).toBeCalledWith();
  });

  it("support lifecycle:更新阶段-shouldComponent返回true", () => {
    const initialProps = {
      name: "Taylor"
    };
    const state = {
      count: 5
    };
    const instance = new LifeCycleDemo(initialProps);

    instance.getDerivedStateFromProps = jest.fn();

    instance.render = jest.fn();

    instance.shouldComponentUpdate = jest.fn(() => true);

    instance.getSnapshotBeforeUpdate = jest.fn(() => ({
      name: "snapshot"
    }));

    instance.componentDidUpdate = jest.fn();

    subsquentedRender(initialProps, state, instance);

    expect(instance.getDerivedStateFromProps).toBeCalledWith(
      initialProps,
      state
    );

    expect(instance.shouldComponentUpdate).toBeCalledWith(initialProps, state);

    expect(instance.render).toBeCalledWith(initialProps, state);

    expect(instance.getSnapshotBeforeUpdate).toBeCalledWith(
      initialProps,
      state
    );

    // getSnapshotBeforeUpdate的返回值是componentDidUpdate的第三个参数
    expect(instance.componentDidUpdate).toBeCalledWith(initialProps, state, {
      name: "snapshot"
    });
  });

  it("support lifecycle:更新阶段-shouldComponent返回false", () => {
    const initialProps = {
      name: "Taylor"
    };
    const state = {
      count: 5
    };
    const instance = new LifeCycleDemo(initialProps);

    instance.getDerivedStateFromProps = jest.fn();

    instance.render = jest.fn();

    instance.shouldComponentUpdate = jest.fn(() => false);

    instance.getSnapshotBeforeUpdate = jest.fn(() => ({
      name: "snapshot"
    }));

    instance.componentDidUpdate = jest.fn();

    subsquentedRender(initialProps, state, instance);

    expect(instance.getDerivedStateFromProps).toBeCalledWith(
      initialProps,
      state
    );

    expect(instance.shouldComponentUpdate).toBeCalledWith(initialProps, state);

    expect(instance.render).not.toBeCalledWith(initialProps, state);

    expect(instance.getSnapshotBeforeUpdate).not.toBeCalledWith(
      initialProps,
      state
    );

    // getSnapshotBeforeUpdate的返回值是componentDidUpdate的第三个参数
    expect(instance.componentDidUpdate).not.toBeCalledWith(
      initialProps,
      state,
      {
        name: "snapshot"
      }
    );
  });
});
