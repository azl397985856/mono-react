import ReactDOM from "./mini-react-dom";

function componentWillUnMount() {}

function reRender(rootReactElement, rootDOMElement) {
  // 移除之前的节点（之后引入调和算法后进行优化）
  while (rootDOMElement.hasChildNodes()) {
    // 遍历调用componentWillUnMount
    rootDOMElement.removeChild(rootDOMElement.lastChild);
  }
  ReactDOM.render(rootReactElement, rootDOMElement);
}

class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.getSnapshotBeforeUpdate = this.getSnapshotBeforeUpdate.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }
  shouldComponentUpdate() {}
  componentDidMount() {}
  getSnapshotBeforeUpdate() {}
  componentDidUpdate() {}
  setState(partialState) {
    this.nextState = Object.assign({}, this.state, partialState);

    // 在后面的章节（调和算法）我们进行优化
    reRender(window.vdom, window.el);

    this.state = this.nextState;
  }
}

export default Component;
