# 从零开始开发一个 React

这个是从零开始开发一个 React 系列的第一篇。

## 先行知识

学习这个课程之前呢，需要各位了解 React 的 api，以及做了什么事情。

如果完全不了解的话，不建议您继续往下看。

如果你已经具备了相关 React 的知识，那么就让我们开始吧。

## 本章要实现的效果

我从 React 的官方文档拿了一个例子过来。

官方是这么说的

`We have several examples on the website. Here is the first one to get you started:`

那么就让我们实现这样一个功能开始吧。

> 本章不会实现 jsx 语法，我们会在接下来的章节中实现，不要着急。

```js
class HelloMessage extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

ReactDOM.render(
  <HelloMessage name="Taylor" />,
  document.getElementById("container")
);
```

我们也要实现类似的效果，我们真实实现的效果是这样的：

```js
const HelloMessage = ({ name }) =>
  React.createElement("div", { name: "Taylor" }, `Hello ${name}`);

// render to dom
ReactDOM.render(
  HelloMessage({ name: "Taylor" }),
  document.getElementById("root")
);
```

可以看出区别：

1.  我们没有使用 React.Component， 而是使用了纯函数

2.  我们没有使用 jsx

为了保证尽可能让大家做出来一个最简化版本的。因此我们故意去除了这些东西。
并且会在接下来的章节中慢慢实现。
