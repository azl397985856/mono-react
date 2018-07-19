const listDiff = require("list-diff2");

const REPLACE = 0; // 替换
const ORDER = 1; // children顺序变更
const PROP = 2; // 属性变更
const TEXT = 3; // 文本变更

function isString(a) {
  return typeof a === "string";
}

// 这个是最复杂的
function diffChildren(
  vdomChildren,
  ovdomChildren,
  index,
  diffInfo,
  currentDiffInfo
) {
  // 这里的最小编辑问题，采用动态规划解决，为了项目复杂度考虑直接引入了一个开源库list-diff2
  // see more: https://github.com/livoras/list-diff
  const diffs = listDiff(ovdomChildren, vdomChildren, "key");
  vdomChildren = diffs.children;

  if (diffs.moves.length) {
    currentDiffInfo.push({ type: ORDER, moves: diffs.moves });
  }

  ovdomChildren.forEach(function(child, i) {
    const newChild = vdomChildren[i];

    dfs(child, newChild, ++index, diffInfo);
  });
}

function diffProps(vdom, ovdom) {
  const oldProps = ovdom.props;
  const newProps = vdom.props;

  const diffInfo = {};

  for (key in newProps) {
    if (!oldProps.hasOwnProperty(key)) {
      // 新增属性
      diffInfo[key] = newProps[key];
    }
  }

  for (key in oldProps) {
    if (newProps[key] !== oldProps[key]) {
      // 属性不同
      diffInfo[key] = newProps[key];
    }
  }

  return diffInfo;
}

function dfs(vdom, ovdom, index, diffInfo) {
  // 当前这个节点（有编号的）的diff信息
  var currentDiffInfo = [];

  // 删除节点
  if (vdom === null) {
  } else if (isString(ovdom) && isString(vdom)) {
    // textContent
    if (vdom !== ovdom) {
      currentDiffInfo.push({ type: TEXT, content: vdom });
    }
  } else if (ovdom && ovdom.type === vdom.type && ovdom.key === vdom.key) {
    // Diff props
    var propsPatches = diffProps(vdom, ovdom);
    if (propsPatches) {
      currentDiffInfo.push({ type: PROP, props: propsPatches });
    }

    diffChildren(
      ovdom.children,
      vdom.children,
      index,
      diffInfo,
      currentDiffInfo // children需要将起diffInfo插入到currentDiffInfo中
    );
  } else {
    currentDiffInfo.push({ type: REPLACE, node: vdom });
  }

  diffInfo[index] = currentDiffInfo;
}

function diff(vdom, ovdom) {
  // 当前的节点的标志。采用DFS算法。
  var index = 0;

  // 将每个节点的差异（如果有）记录在下面的对象中。
  var diffInfo = [];

  dfs(vdom, ovdom, index, diffInfo);
  // 最终diff算法返回的是一个两棵树的差异。
  return diffInfo;
}

module.exports = {
  diff
};
