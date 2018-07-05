import Component from "./component";

const isListener = propName => propName.startsWith("on");
const isAttribute = propName => !isListener(propName) && propName != "children";
const isClass = function(type) {
  // type 继承自 Component， 则证明其就是class
  return type.prototype instanceof Component;
};

function getDOM(type, props, el) {
  const isTextElement = type === "TEXT";

  if (isTextElement) {
    return document.createTextNode("");
  } else if (isClass(type)) {
    if (!type.instance) {
      type.instance = new type(props);
    }
    // 下面代码需要修改，因为每次调用都会使用最初的state
    // 需要修改为组件内部维持的state
    return ReactDOM.render(
      type.instance.render(props, type.instance.state || {}),
      el
    );
  }
  return document.createElement(type);
}

const ReactDOM = {
  render(vdom, el) {
    // hack
    if (!window.vdom) {
      window.vdom = vdom;
    }
    if (!window.el) {
      window.el = el;
    }

    const { type, props } = vdom;
    // Create DOM element
    const dom = getDOM(type, props, el);

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

    return dom;
  }
};

export default ReactDOM;
