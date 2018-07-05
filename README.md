# 从零开始开发一个 React

这个是从零开始开发一个 React 系列的第四篇。

## 先行知识

学习这个课程之前呢，需要各位了解 React 的 api，以及做了什么事情。

如果完全不了解的话，不建议您继续往下看。

如果你已经具备了相关 React 的知识，那么就让我们开始吧。

## 本章要实现的效果

上一节我们已经完整实现了 React 官网给的最简单的例子。

上节实现的效果是这样的：

```js
class HelloMessage extends React.Component {
  // render函数和react的render略有不同
  // 这里借鉴了preact的思想，将props和state通过参数传到render函数中去
  render({ name }) {
    return <div>Hello {name}</div>;
  }
}

// render to dom
ReactDOM.render(
  <HelloMessage name="Taylor" />,
  document.getElementById("root")
);
```

我们这个 APP 如果需要更新，则需要我们手动调用 `ReactDOM.render`

有三个问题：

1.  不方便，每次更新都需要调用 TOP_LEVEL API 更新。如果是子组件，则需要在子组件拿到整个 VDOM（我们会在本节修复）

2.  似乎我们写的代码有`bug`，每次 ReactDOM.render 都会生成新的元素，之前的元素不会删除。（我们会在本节修复）

3.  每次都会重新渲染，浪费性能（我们会在调和算法一节修复）

为此我们引入一个新的概念，就是 `State`，并且引入一个新的 API - `setState` 用于改变组件的 state

最终实现的效果：

上节实现的效果是这样的：

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick() {
    this.setState({
      count: this.state.count + 1
    });
  }
  render({ name }, { count }) {
    return <div onClick={this.handleClick.bind(this)}>Count: {count}</div>;
  }
}

// render to dom
ReactDOM.render(<Counter count={0} />, document.getElementById("root"));
```
