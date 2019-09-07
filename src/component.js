import ReactDOM from "./mini-react-dom";

function reRender(rootReactElement, rootDOMElement) {
  // 移除之前的节点（之后引入调和算法后进行优化）
  while (rootDOMElement.hasChildNodes()) {
    rootDOMElement.removeChild(rootDOMElement.lastChild);
  }
  ReactDOM.render(rootReactElement, rootDOMElement);
}

class Component {
  constructor(props, state) {
    this.props = props;
    this.state = state || {};
  }
  setState(partialState) {
    this.state = Object.assign({}, this.state, partialState);
    // 这个render只是渲染生成vdom，界面不会真正刷新
    // this.render(this.props, this.state);
    // 在后面的章节（调和算法）我们进行优化
    reRender(window.vdom, window.el);
  }
}

export default Component;
