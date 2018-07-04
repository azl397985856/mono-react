# 从零开始开发一个 React

这个是从零开始开发一个 React 系列的第二篇。

## 先行知识

学习这个课程之前呢，需要各位了解 React 的 api，以及做了什么事情。

如果完全不了解的话，不建议您继续往下看。

如果你已经具备了相关 React 的知识，那么就让我们开始吧。

## 本章要实现的效果

上一节我们已经实现了 React 官网给的最简单的例子。

我们仍然遗留了两个问题：

1.  我们没有使用 React.Component， 而是使用了纯函数

2.  我们没有使用 jsx

我们先来解决第一个问题。

最终实现的效果是这样的：

```js
class HelloMessage extends React.Component {
  // render函数和react的render略有不同
  // 这里借鉴了preact的思想，将props和state通过参数传到render函数中去
  render({ name }) {
    return React.createElement("div", { name }, `Hello ${name}`);
  }
}

// render to dom
ReactDOM.render(
  React.createElement(HelloMessage, {name: "Taylor"),
  document.getElementById("root")
);
```
