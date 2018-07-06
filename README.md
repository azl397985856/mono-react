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

为此我们引入一个新的概念，就是 `State`，并且引入一个新的 API - `setState` 用于改变组件的 state。

我们先给 Component 增加 state 属性用于保存状态，并 setState 方法用于修改 state 并更新界面。

```js
// component.js
+import ReactDOM from "./mini-react-dom";
+
+function reRender(rootReactElement, rootDOMElement) {
+  // 移除之前的节点（之后引入调和算法后进行优化）
+  while (rootDOMElement.hasChildNodes()) {
+    rootDOMElement.removeChild(rootDOMElement.lastChild);
+  }
+  ReactDOM.render(rootReactElement, rootDOMElement);
+}
+
 class Component {	 class Component {
   constructor(props) {	   constructor(props) {
     this.props = props;	     this.props = props;
+    this.state = this.state || {};
+  }
+  setState(partialState) {
+    this.state = Object.assign({}, this.state, partialState);
+    // 这个render只是渲染生成vdom，界面不会真正刷新
+    // this.render(this.props, this.state);
+    // 在后面的章节（调和算法）我们进行优化
+    reRender(vdom,el);
   }	   }
 }	 }
```

setState 方法接受一个对象，用于将其合并到 this.state,然后调用`reRender`重新渲染页面，

`reRender`逻辑很简单，就是删除当前节点下的所有节点（暂时没有引入调和算法，所以就是这么粗暴），然后重新
调用 ReactDOM.render。

问题的关键在于

```js
// 这一行代码的vdom，el哪来的？
+reRender(vdom, el);
```

vdom 和 el 其实就是 `ReactDOM.render(vdom, el)`,
我们只需要将 ReactDOM.render 的 vdom 和 el 存起来，在这里使用就 ok。

代码是这样：

```js
 const ReactDOM = {
   render(vdom, el) {

+    if (!window.vdom) {
+      window.vdom = vdom;
+    }
+    if (!window.el) {
+      window.el = el;
+    }
     ...
    }
```

getDOM 之前每次调用都会生成一个新的实例，因此这里需要修改：

```js
 function getDOM(type, props, el) {
   const isTextElement = type === "TEXT";	   const isTextElement = type === "TEXT";

   if (isTextElement) {	   if (isTextElement) {
     return document.createTextNode("");	     return document.createTextNode("");
   } else if (isClass(type)) {	   } else if (isClass(type)) {
-    return ReactDOM.render(new type(props).render(props), el);	+    // 组件实例只创建一次，创建成功之后挂在到type上
+    // 以便下次可以访问
+    if (!type.instance) {
+      type.instance = new type(props);
+    }
+    return ReactDOM.render(
+      type.instance.render(props, type.instance.state || {}),
+      el
+    );
   }	   }
   return document.createElement(type);	   return document.createElement(type);
 }	 }
```

将 instance 挂在到 type 上，如果下次 type 上有 instance 就表示已经实例话了，不需要重新实例化。

> 后面讲生命周期和调和算法的时候会往 instance 添加更多的东西

最终实现的效果：

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

感谢你的阅读， 下一节我们[增加生命周期](https://github.com/azl397985856/mono-react/tree/lecture/part5)
