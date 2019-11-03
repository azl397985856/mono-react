# 从零开始开发一个 React

这个是从零开始开发一个 React 系列的第五篇。

## 先行知识

学习这个课程之前呢，需要各位了解 React 的 api，以及做了什么事情。

如果完全不了解的话，不建议您继续往下看。

如果你已经具备了相关 React 的知识，那么就让我们开始吧。

## 本章要实现的效果

本章主要实现 react 的声明周期。

我们先来介绍一下 react 的声明周期（V16.4.1）

ReactV16 的生命周期分为四种，分别为挂载阶段（Mounting）
更新阶段（Updating），卸载阶段（Unmounting）和发生错误阶段（Error Handling）

这里不介绍各个生命周期详细的作用和用法，只是做一个简单的介绍。

### Mounting

挂载阶段，会在组件实例化并挂在到节点的时候执行一次，因此对于一个组件实例来说其只会执行一次。

这个阶段的生命周期按照时间顺序排列有：

- constructor(props)

- static getDerivedStateFromProps(props, state)

- render(props, state)

- componentDidMount()

### Updating

更新阶段，会在组件 state 或者 props 改变，或者 forceUpdate 调用的时候执行。因此对于一个组件实例来说其会执行多次。

这个阶段的生命周期按照时间顺序排列有：

- static getDerivedStateFromProps(props, state)

- shouldComponentUpdate(nextProps, nextState)

- render(props, state)

- getSnapshotBeforeUpdate(props, state)

// (snapshot here is the value returned from getSnapshotBeforeUpdate)

- componentDidUpdate(props, state, snapshot)

### Unmounting

卸载阶段，会在组件从节点中移除的时候执行一次，因此对于一个组件实例来说其只会执行一次。

这个阶段的生命周期只有一个：

- componentWillUnmount()

> later

### Error Handling

错误捕获阶段，会在组件组件发生错误的时候执行，因此对于一个组件实例来说其会执行多次。

这个阶段的生命周期只有一个：

- componentDidCatch(error, info)

> later

## 开始实现

我们依然是给 Component 增加生命周期，因此我们往 component.js 中添加代码

```js
// component.js


class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
+   this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
+   this.componentDidMount = this.componentDidMount.bind(this)
+   this.getSnapshotBeforeUpdate = this.getSnapshotBeforeUpdate.bind(this);
+   this.componentDidUpdate = this.componentDidUpdate.bind(this)
  }
  setState(partialState) {
+   this.nextState = Object.assign({}, this.state, partialState);

    // 在后面的章节（调和算法）我们进行优化
    reRender(window.vdom, window.el);

+   this.state = this.nextState;
  }
}

export default Component;
```

`constructor`增加的代码就是为了绑定 this，防止 this 被指向别的地方。

`setState`中增加的代码是为了组件在拿到运算后的 state 和当前组件的`state`。典型的用法就是
在`shouldComponentUpdate`中判断是否需要更新

然后我们再来修改 react-dom 。

> 以下代码都为新增

我首先定义了各个生命周期。
然后定义了两个方法，第一个是首次渲染`firstRender`（挂载阶段），
第二个是接下来的渲染`subsquentedRender`（更新阶段）

```js
// react-dom.js
function componentDidMount() {}
// It should return an object to update the state, or null to update nothing.
function getDerivedStateFromProps(props, state) {
  return null;
}

function shouldComponentUpdate() {
  return true;
}

function getSnapshotBeforeUpdate(props, state, snapshot) {}

function componentDidUpdate() {}

// later
// function componentDidCatch() {}

function firstRender(props, state, instance) {
  // 1.getDerivedStateFromProps
  (instance.getDerivedStateFromProps || getDerivedStateFromProps)(props, state);
  // 2.render
  const vdom = instance.render(props, state);
  // 3.componentDidMount
  (instance.componentDidMount || componentDidMount)();
  return vdom;
}

function subsquentedRender(props, state, instance) {
  // 1. getDerivedStateFromProps
  (instance.getDerivedStateFromProps || getDerivedStateFromProps)(props, state);
  // 2. shouldComponentUpdate
  const shouldRender = (instance.shouldComponentUpdate ||
    shouldComponentUpdate)(props, state);
  if (!shouldRender) {
    return instance.vdom;
  }
  // 3. render
  const vdom = instance.render(props, state);
  // 4. getSnapshotBeforeUpdate
  (instance.getSnapshotBeforeUpdate || getSnapshotBeforeUpdate)();
  // 5. componentDidUpdate
  (instance.componentDidUpdate || componentDidUpdate)();
  return vdom;
}
```

继续修改 getDOM 方法：

```js
if (!type.instance) {
      const instance = new type(props);
      type.instance = instance;
      type.instance.type = type;
      // 首次渲染，调用firstRender
      // 注意这里type.instance.state 改成了 type.instance.nextState
      const vdom = firstRender(props, type.instance.nextState || {}, type.instance);
      // 保存vdom到instance，后面subsquentedRender如果不需要更新
      // （shouldComponentUpdate返回false）会用到
      type.instance.vdom = vdom;
      return ReactDOM.render(vdom, el);
    }
    // 更新阶段
    const vdom = subsquentedRender(
      props,
      type.instance.state || {},
      type.instance
    );
    // 保存vdom到instance，后面subsquentedRender如果不需要更新
    // （shouldComponentUpdate返回false）会用到
    type.instance.vdom = vdom;
    return ReactDOM.render(vdom, el);
}
```

最终实现效果

```js
class LifeCycleDemo extends React.Component {
  constructor(props) {
    super(props);
    console.log("constructor with props: ", props);
  }
  shouldComponentUpdate(props, state) {
    // 你可以在这里进行计算，然后返回true，false
    // 来控制render与否
    console.log(
      "next props: ",
      props,
      "currentProps:",
      this.props,
      "nextState:",
      state,
      "currentState:",
      this.state
    );
  }
  getSnapshotBeforeUpdate(props, state) {
    console.log("getSnapshotBeforeUpdate with props: ", props, "state:", state);
    return {
      name: "snapshot"
    };
  }
  componentDidUpdate(props, state, snapshot) {
    console.log(
      "componentDidUpdate with props: ",
      props,
      "state:",
      state,
      "snapshot:",
      snapshot
    );
  }
  componentDidMount() {
    console.log("componentDidMount");
  }
  componentWillUnmount() {
    console.log("componentWillUnmount");
  }
  // render函数和react的render略有不同
  // 这里借鉴了preact的思想，将props和state通过参数传到render函数中去
  render(props, state) {
    console.log("render with props: ", props, "render with state:", state);
    return <div>Hello {props.name}</div>;
  }
}

// render to dom
ReactDOM.render(
  <LifeCycleDemo name="Taylor" />,
  document.getElementById("root")
);
```

感谢你的阅读， 下一节我们[加 dom-diff（调和算法）](https://github.com/azl397985856/mono-react/tree/lecture/part6) 
