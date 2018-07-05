# 从零开始开发一个 React

这个是从零开始开发一个 React 系列的第一篇。

## 先行知识

学习这个课程之前呢，需要各位了解 React 的 api，以及做了什么事情。

如果完全不了解的话，不建议您继续往下看。

如果你已经具备了相关 React 的知识，那么就让我们开始吧。

## 本章要实现的效果

我直接从 React 的官方文档拿了一个例子过来。

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
  React.createElement("div", null, `Hello ${name}`);

// render to dom
ReactDOM.render(
  HelloMessage({ name: "Taylor" }),
  document.getElementById("root")
);
```

可以看出区别：

1.  我们没有使用 React.Component， 而是使用了纯函数(我们会在第二节实现)

2.  我们没有使用 jsx (我们会在第三节实现)

为了保证尽可能让大家做出来一个最简化版本的。因此我们故意去除了这些东西。
并且会在接下来的章节中慢慢实现。

## 开始实现

从上面的例子可以看出，我们使用了两个 React 的 API。

### React.createElement

一个是`React.createElement`, 用于创建 VDOM，
VDOM 是一种用来描述浏览器 DOM tree 的数据结构。

比如如下的 html

```html
    <ul className="wrapper">
        <li id="li1">text1</li>
        <li id="li2">text2</li>
    </ul>
```

我们通过 type 去区分 DOM 节点的类型，通过 props 去给 DOM 节点绑定 attributes。
children 是它的子节点，拥有一样的数据结构，即具有 type, props 和 children 属性。

上述 DOM tree 经过 VDOM 抽象会变成:

```js
{
    type: 'ul',
    props: {
        className: 'wrapper'
    }
    children: [{
        type: 'li',
        props: {
            id: 'li1'
        },
        children: {
            type: "TEXT",
            children: ['text1']
        }
    }, {
        type: 'li',
        props: {
            id: 'li2'
        },
         children: {
            type: "TEXT",
            children: ['text2']
        }
    }]
}
```

从上可以看出，其实我们只是以 VDOM 去`抽象` DOM tree。

换句话说，根据 VDOM 可以生成一个的 DOM tree。

每次视图（DOM）需要改变，我们只需要更新 VDOM，然后重新从最新的 VDOM 映射到真实 DOM 即可。

通过`React.createElement(type, props, children)`这个 API，就可以生成一个 VDOM，后面我们会引入 jsx，
jsx 只不过是`React.createElement`的语法糖,最终调用的仍然是`React.createElement`.

让我们来实现它：

```js
function $createElement(type, _props, ...children) {
  // 浅拷贝
  const props = Object.assign({}, _props);

  // 将props.children 和 children 进行合并
  const hasChildren = children.length > 0;
  const mergedChildren = hasChildren ? [].concat(...children) : [];

  props.children = mergedChildren;

  return { type, props };
}

function createElement(el, props, ...children) {
  return $createElement(el, props || {}, ...children);
}
```

考虑到文本节点， 处理方式不太一样。 后面会有更多类型的节点，比如 class 节点，我们到时候在添加对应逻辑。

> 友情提示， 代码行前面的 + 代表增加的代码 。 - 代表删除的代码

```js
+ const TEXT_ELEMENT = "TEXT";

+ function createTextElement(value) {
+    // 用于之后给DOM设置属性
+  return createElement(TEXT_ELEMENT, { nodeValue: value });
+ }

// createElement前两个参数分别为type和props
// 之后的所有参数都会被看作children
// 当然props.children 也会被看作children(createElement会进行合并)
function $createElement(type, _props, ...children) {
  const props = Object.assign({}, _props);

  const hasChildren = children.length > 0;
  const mergedChildren = hasChildren ? [].concat(...children) : [];

  props.children = mergedChildren
+    .filter(c => c != null && c !== false)
+    .map(c => (c instanceof Object ? c : createTextElement(c)));
  return { type, props };
}

function createElement(el, props, ...children) {
  return $createElement(el, props || {}, ...children);
}
```

### ReactDOM.render

另一个 API 是`ReactDOM.render`。前面提到了`根据 VDOM 可以生成一个的 DOM tree`
其实就是`ReactDOM.render` 做的事情。

它的函数签名是 `ReactDOM.render(vdom , el)` 。其中 vdom 是我们生成的 vdom，el 则是挂载的 DOM 节点。

代码比较简单，并且有注释，让我们直接看代码吧。

代码如下：

```js
const isListener = propName => propName.startsWith("on");
const isAttribute = propName => !isListener(propName) && propName != "children";

const ReactDOM = {
  render: (vdom, el) => {
    const { type, props } = vdom;

    // 是不是知道前面为什么特殊处理文本节点了？
    const isTextElement = type === "TEXT";
    const dom = isTextElement
      ? document.createTextNode("")
      : document.createElement(type);

    // 添加监听函数
    Object.keys(props)
      .filter(isListener)
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, props[name]);
      });

    //  添加Attributes
    Object.keys(props)
      .filter(isAttribute)
      .forEach(name => {
        // className特殊逻辑
        if (name === "className") {
          dom.class = props[name];
        } else {
          dom[name] = props[name];
        }
      });

    // 递归children
    const childElements = props.children || [];
    childElements.forEach(childElement => ReactDOM.render(childElement, dom));

    // 插入到真实dom
    el.appendChild(dom);
  }
};
```

OK，一个最最最最小化的 React 就完成了

感谢你的阅读， 下一节我们介绍 [增加 Class 的支持](https://github.com/azl397985856/mono-react/tree/lecture/part2)
