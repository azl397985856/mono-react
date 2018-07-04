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
