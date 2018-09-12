import ReactDOM from "./mini-react-dom";

const REPLACE = 0; // 替换
const ORDER = 1; // children顺序变更
const PROP = 2; // 属性变更
const TEXT = 3; // 文本变更

function setAttr(node, key, value) {
  switch (key) {
    case "style":
      node.style.cssText = value;
      break;
    case "value":
      const tagName = (node.type || "").toLowerCase();

      if (tagName === "input" || tagName === "textarea") {
        node.value = value;
      } else {
        node.setAttribute(key, value);
      }
      break;
    default:
      node.setAttribute(key, value);
      break;
  }
}

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

function apply(el, currentDiffInfos) {
  currentDiffInfos.forEach(function(currentDiffInfo) {
    switch (currentDiffInfo.type) {
      case REPLACE:
        const newNode =
          typeof currentDiffInfo.node === "string"
            ? document.createTextNode(currentDiffInfo.node)
            : ReactDOM.render(
                currentDiffInfo.node,
                el.parentNode.cloneNode(false)
              );

        el.parentNode.replaceChild(newNode, el);
        break;
      case ORDER:
        reorderChildren(el, currentDiffInfo.moves);
        break;
      case PROP:
        setProps(el, currentDiffInfo.props);
        break;
      case TEXT:
        if (el.textContent !== undefined) {
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

function setProps(el, props) {
  for (var key in props) {
    if (!!!props[key]) {
      el.removeAttribute(key);
    } else {
      var value = props[key];
      setAttr(el, key, value);
    }
  }
}

function reorderChildren(el, moves) {
  moves.forEach(function(move) {
    var index = move.index;
    if (move.type === 0) {
      el.removeChild(el.childNodes[index]);
    } else if (move.type === 1) {
      var insertNode =
        typeof move.item === "object"
          ? move.item.render()
          : document.createTextNode(move.item);

      el.insertBefore(insertNode, el.childNodes[index] || null);
    }
  });
}

function patch(el, diffInfo) {
  // 对象是引用传递
  const walker = { index: 0 };
  dfs(el, walker, diffInfo);
}
module.exports = {
  patch
};
