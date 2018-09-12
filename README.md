# 从零开始开发一个 React

这个是从零开始开发一个 React 系列的第六篇。

## 先行知识

学习这个课程之前呢，需要各位了解 React 的 api，以及做了什么事情。

如果完全不了解的话，不建议您继续往下看。

如果你已经具备了相关 React 的知识，那么就让我们开始吧。

## 本章要实现的效果

本章主要实现 react 的 dom-diff（调和算法）。

前一章的算法比较简单，就是直接将原来的 DOM 移除，然后重新执行一遍 render。
这对于构建中大型应用是不能接受的。 我们这一章就打算使用 dom-diff 算法进行优化。
网上关于 dom-diff 的文章多如牛毛，我们这个系列主要是实战，这些理论知识可以才别的地方了解。

> 希望大家对 dom-diff 稍有了解再继续阅读。

## 开始实现

我们将之前的代码做一些修改，之前是这样的：

```js
function reRender(rootReactElement, rootDOMElement) {
  // 移除之前的节点（之后引入调和算法后进行优化）
  while (rootDOMElement.hasChildNodes()) {
    // 遍历调用componentWillUnMount
    rootDOMElement.removeChild(rootDOMElement.lastChild);
  }
  ReactDOM.render(rootReactElement, rootDOMElement);
}
```

我们要改成性能更好的写法：

```js
function reRender(vdom, ovdom, el) {
  // 找出虚拟dom的差异部分
  const diffInfo = diff(vdom, ovdom);
  // 将差异部分应用到真实节点
  // 更新虚拟dom
  // 更新旧的虚拟dom
  patch(el, diffInfo);
}
```

因此我们的工作就是要去实现 diff 和 patch 方法。

### 实现 diff

前面我们讲了虚拟 dom，虚拟 dom 的本质是一个 js 对象，用来表示真实的 dom。
我们可以根据虚拟 dom，生成唯一的一个真实 dom 结构。

一点点理论：

```js
const vdom = {
  type: "div",
  props: {},
  children: []
};

const ovdom = {
  type: "div",
  props: {
    className: "red"
  },
  children: []
};
```

上面是两个 vdom，一个是变化前的我们极为 ovdom，另外一个是变化后的我们称之为 vdom。

我们的目标就是比较出两者的差异，然后将差异传给 patch，让 patch 最终给 current dom 打补丁，去生成新的真实 dom。

我们需要一种数据结构来完成这样的事情，在讲解数据结构之前，我们来看下如何给真实 dom 打补丁。
其实无外乎替换，调整顺序，修改属性，修改文本。 我们用一个常量记住这些类型方便使用

```js
const REPLACE = 0; // 替换
const ORDER = 1; // children顺序变更
const PROP = 2; // 属性变更
const TEXT = 3; // 文本变更
```

我们需要去遍历这个树，然后将每一个节点的信息都存起来。我们深度遍历树，然后一次给节点一个索引。

数据结构形如：

```js
// type的含义前面通过常量声明过了
const node0DiffInfo = { type: 2, props: {} };
const node1DiffInfo = { type: 1, moves: [[{}]] };

const diffInfo = [node1DiffInfo, node1DiffInfo];
```

diff 的具体算法，我这里直接使用了一个库`list-diff2`，由于这部分知识讲解起来也要
花点功夫，这篇文章就不做深入介绍了，有兴趣自己研究下。

### 实现 patch

我们已经拿到 diff info 了，剩下工作就简单了，直接将 diff info 应用到树上就好了。
也是一个深度遍历。

核心代码：

```js
function dfs(el, walker, diffInfo) {
  var currentDiffInfos = diffInfo[walker.index];

  var len = el.childNodes ? el.childNodes.length : 0;
  for (let i = 0; i < len; i++) {
    const child = el.childNodes[i];
    walker.index++;
    dfs(child, walker, diffInfo);
  }

  if (currentDiffInfos) {
    apply(el, currentDiffInfos);
  }
}
```

apply 的代码比较简单，就是根据之前声明的类型调用原生的 web-api。

代码是这样的：

```js
function apply(el, currentDiffInfos) {
  currentDiffInfos.forEach(function(currentDiffInfo) {
    switch (currentDiffInfo.type) {
      case REPLACE:
        const newNode =
          typeof currentDiffInfo.node === "string"
            ? document.createTextNode(currentDiffInfo.node)
            : ReactDOM.render(currentDiffInfo.node, el.cloneNode(false));

        el.parentNode.replaceChild(newNode, el);
        break;
      case REORDER:
        reorderChildren(el, currentDiffInfo.moves);
        break;
      case PROPS:
        setProps(el, currentDiffInfo.props);
        break;
      case TEXT:
        if (el.textContent) {
          el.textContent = currentDiffInfo.content;
        } else {
          el.nodeValue = currentDiffInfo.content;
        }
        break;
      default:
        throw new Error("未知类型 " + currentDiffInfo.type);
    }
  });
}
```

## 总结

感谢你的阅读， 下一节我们[引入 context api] ， 文章还未更新～
