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

## 添加 React.Component

首先我们定义`React.Component`,
这个很简单，我们直接使用 es6 的 class 简化代码。

代码如下：

```js
// component.js
+ class Component {
+  constructor(props) {
+    this.props = props;
+  }
+ }
+ export default Component;

// mini-react.js
const React = {
  createElement,
+  Component: require("./component").default
};
export default React;
```

React.render 函数之前只支持普通文本类型和内置类型（div，span 等）。
对于 class 并不支持，我们现在来改造一下。

代码如下：

```js
const ReactDOM = {
  render(vdom, el) {
    const { type, props } = vdom;

-    const isTextElement = type === "TEXT";
-    const dom = isTextElement
-      ? document.createTextNode("")
-      : document.createElement(type);

    // Create DOM element
+    const dom = getDOM(type, props, el);

    ...

    // 插入到真实dom
    el.appendChild(dom);
+   return dom;
  }
};
```

getDOM 方法用于返回 dom。

```js
+const isClass = function(type) {
+  // type 继承自 Component， 则证明其就是class
+  return type.prototype instanceof Component;
+};
+function getDOM(type, props, el) {
+  const isTextElement = type === "TEXT";

+  if (isTextElement) {
+    return document.createTextNode("");
+  } else if (isClass(type)) { // 其实只是加了一个这样的逻辑而已
+    return ReactDOM.render(new type(props).render(props), el);
+  }
+  return document.createElement(type);
+}
```

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
  React.createElement(HelloMessage, {name: "Taylor")},
  document.getElementById("root")
);
```

感谢你的阅读， 下一节我们[增加 JSX 的支持](https://github.com/azl397985856/mono-react/tree/lecture/part3)
