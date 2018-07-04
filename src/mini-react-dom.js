const isListener = propName => propName.startsWith("on");
const isAttribute = propName => !isListener(propName) && propName != "children";

const ReactDOM = {
  render: (vdom, el) => {
    const { type, props } = vdom;

    // Create DOM element
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

export default ReactDOM;
