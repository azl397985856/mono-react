# 从零开始开发一个 React

这个是从零开始开发一个 React 系列的第三篇。

## 先行知识

学习这个课程之前呢，需要各位了解 React 的 api，以及做了什么事情。

如果完全不了解的话，不建议您继续往下看。

如果你已经具备了相关 React 的知识，那么就让我们开始吧。

## 本章要实现的效果

上一节我们已经实现了 React 官网给的最简单的例子。

我们仍然遗留了最后个问题：

1.  我们没有使用 jsx

我们知道 jsx 只是 React.createElement 的语法糖，那么其实
只需要使用者使用 jsx 之后，将 jsx 转化成我原生的 React.createElement 语法就可以了。

说到这里，可能大家都能想到有一个 babel 插件就是做这样的一个事情。

没错，我们直接用就好了。

只需要`使用者`项目中增加如下 .babelrc 就可以了。

```json
+{
+  "plugins": ["transform-react-jsx"]
+}
```

最终实现的效果是这样的：

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

大家如果对`transform-react-jsx`的原理有兴趣的话，我考虑专门写一篇介绍它。

感谢你的阅读， 下一节我们[增加 state 支持](https://github.com/azl397985856/mono-react/tree/lecture/part4)
