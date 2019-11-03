import ReactDOM from "./mini-react-dom";

import { diff } from "./diff";
import { patch } from "./patch";

function componentWillUnMount() {}

function reRender(vdom, ovdom, el) {
  // 找出虚拟dom的差异部分
  const diffInfo = diff(vdom, ovdom);
  // 将差异部分应用到真实节点
  // 更新虚拟dom
  // 更新旧的虚拟dom
  patch(el, diffInfo);
}

class Component {
  constructor(props) {
    this.props = props;
    this.context = this.constructor.contextType && this.constructor.contextType.Provider.currentValue;
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
    reRender(window.vdom, window.ovdom, window.el);

    this.state = this.nextState;
  }
}

export default Component;
