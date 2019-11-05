# 从零开始开发一个 React

这个是从零开始开发一个 React 系列的第七篇。想要访问之前的内容可以点击下方的链接进行访问：

1.  [最简单的实现，包括 vdom 结构，createElement，ReactDOM.render](https://github.com/azl397985856/mono-react/tree/lecture/part1)

2.  [增加 Class 的支持](https://github.com/azl397985856/mono-react/tree/lecture/part2)

3.  [增加 JSX 的支持](https://github.com/azl397985856/mono-react/tree/lecture/part3)

4.  [增加 state 支持](https://github.com/azl397985856/mono-react/tree/lecture/part4)

5.  [增加声明周期](https://github.com/azl397985856/mono-react/tree/lecture/part5)

6.  [增加 dom-diff（调和算法）](https://github.com/azl397985856/mono-react/tree/lecture/part6)

## 先行知识

学习这个课程之前呢，需要各位了解 React 的 api，以及做了什么事情。

如果完全不了解的话，不建议您继续往下看。

如果你已经具备了相关 React 的知识，那么就让我们开始吧。

## 本章要实现的效果

本章主要实现 react 的 Context API。

Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。

在一个典型的 React 应用中，数据是通过 props 属性自上而下（由父及子）进行传递的，但这种做法对于某些类型的属性而言是极其繁琐的（例如：地区偏好，UI 主题），这些属性是应用程序中许多组件都需要的。Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。 

## 开始实现

我们继续拿官网的一个[关于Context基础API的例子](https://zh-hans.reactjs.org/docs/context.html#___gatsby)来做。

```jsx
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
// 为当前的 theme 创建一个 context（“light”为默认值）。
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}

```


这里一共需要实现的API有`React.createContext`, 还有一个`contextType`.

### 导出 React.createContext API
我们首先要做的第一件事情就是导出createContextAPI， 尽管这个API我们还没写，我们先占个位置。
```js

const React = {
  createElement,
  Component: require("./component"),
+  createContext: require("./context").createContext
};
```

### 实现数据的存储
我们新建一个文件`context.js` 内容如下：

```js

+ import React from './mini-react';
+ import Component from './component';


+ export function createContext(defaultValue) {
+	return {
+		Provider: class Provider extends Component {
+			render() {
+				return <div></div>
+			}	
+		}
+	}
+}

```

我们先放一个空壳子进去，接下来我们就要实现这个，其实代码很简单。

```js
import React from './mini-react';
import Component from './component';


export function createContext(defaultValue) {
	return {
		Provider: class Provider extends Component {
			render() {
+				const currentValue = this.props.value;
+				Provider.currentValue = currentValue || defaultValue;
				return <div></div>
			}	
		}
	}
}

```
### 实现数据的读取
两行代码搞定了context数据的更新逻辑，如何让所有组件都能接受到里面的值呢？ 我们需要修改下`Component`的实现。

简单增加一行代码:

```js
class Component {
  constructor(props) {
    this.props = props;
+    this.context = this.constructor.contextType && this.constructor.contextType.Provider.currentValue;
    ...
  }
  ...
}

```



## 总结

本节实现了React的Context API相关的功能， 下一节我们引入Ref(文章未更新)
