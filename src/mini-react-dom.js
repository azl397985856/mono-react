import Component from "./component";

const isListener = propName => propName.startsWith("on");
const isAttribute = propName => !isListener(propName) && propName != "children";
const isClass = function(type) {
  // type 继承自 Component， 则证明其就是class
  return type.prototype instanceof Component;
};

const isFunctionComponnet = function(v) {
  const type = v instanceof Function ? v.name : v;
  return (
    type[0] &&
    type[0].charCodeAt(0) >= "A".charCodeAt(0) &&
    type[0].charCodeAt(0) <= "Z".charCodeAt(0)
  );
};

function componentDidMount() {}
// It should return an object to update the state, or null to update nothing.
function getDerivedStateFromProps(props, state) {
  return null;
}

function shouldComponentUpdate(props, state) {
  return true;
}

function getSnapshotBeforeUpdate(props, state) {}

function componentDidUpdate(props, state, snapshot) {}

// later
// function componentDidCatch() {}

function firstRender(props, state, instance, el, type) {
  // 1.getDerivedStateFromProps
  (instance.getDerivedStateFromProps || getDerivedStateFromProps)(props, state);
  // 2.render

  const vdom = instance.render(props, state);
  type.instance.vdom = vdom;
  const dom = ReactDOM.render(vdom, el).childNodes[0];
  // 3.componentDidMount
  (instance.componentDidMount || componentDidMount)(dom);

  return dom;
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
  const snapshot = (instance.getSnapshotBeforeUpdate ||
    getSnapshotBeforeUpdate)(props, state);
  // 5. componentDidUpdate
  (instance.componentDidUpdate || componentDidUpdate)(props, state, snapshot);
  type.instance.vdom = vdom;

  const dom = ReactDOM.render(vdom, el).childNodes[0];
  return dom;
}
function getDOM(type, props, el) {
  const isTextElement = type === "TEXT";

  if (isTextElement) {
    return document.createTextNode("");
  } else if (isClass(type)) {
    // 组件实例只创建一次，创建成功之后挂在到type上
    // 以便下次可以访问
    if (!type.instance) {
      const instance = new type(props);
      type.instance = instance;
      type.instance.type = type;

      const dom = firstRender(
        props,
        type.instance.state || {},
        type.instance,
        el,
        type
      );

      // 挂载ref
      if (typeof props.ref === "object") {
        props.ref.current = instance;
      }
      if (typeof props.ref === "function") {
        props.ref.current = props.ref(instance);
      }

      // TODO: [0]
      return dom;
    }
    const dom = subsquentedRender(
      props,
      type.instance.nextState || {},
      type.instance
    );
    return dom;
  } else if (isFunctionComponnet(type)) {
    return ReactDOM.render(type(props), el).childNodes[0];
  }
  const dom = document.createElement(type);
  // 挂载ref
  if (typeof props.ref === "object") {
    props.ref.current = dom;
  }
  if (typeof props.ref === "function") {
    props.ref.current = props.ref(dom);
  }

  return dom;
}

const ReactDOM = {
  render(vdom, el) {
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
          dom.setAttribute("class", props[name]);
        } else {
          if (dom.setAttribute) {
            dom.setAttribute(name, props[name]);
          } else {
            dom[name] = props[name];
          }
        }
      });

    // 递归children
    const childElements = props.children || [];

    childElements.forEach(childElement => ReactDOM.render(childElement, dom));

    // 插入到真实dom
    el.appendChild(dom);

    window.vdom = vdom;
    window.el = el;

    return el;
  },
};

export default ReactDOM;
