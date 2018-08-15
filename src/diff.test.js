const { diff } = require("./diff");

const REPLACE = 0; // 替换
const ORDER = 1; // children顺序变更
const PROP = 2; // 属性变更
const TEXT = 3; // 文本变更

describe("diff", () => {
  function testDiff() {
    const vdom = {
      type: "div",
      props: {},
      children: [
        {
          type: "div",
          text: "123"
        }
      ]
    };

    const ovdom = {
      type: "div",
      props: {},
      children: []
    };

    return diff(vdom, ovdom);
  }

  // diffInfo: [[{type: 'REPLACE|ORDER|PROP|TEXT'}]]

  // REPLACE -> node
  // ORDER -> moves
  // PROP -> props
  // TEXT -> content
  const diffInfo = testDiff();
  it("diffInfo的数据结构", () => {
    expect(diffInfo).toBeInstanceOf(Array);
    diffInfo.forEach(item => {
      expect(item).toBeInstanceOf(Array);
    });
  });

  it("不同的type，有对应的属性", () => {
    diffInfo.forEach(item => {
      console.log(item);
      item.forEach(current => {
        console.log(current);
        if (current.type === REPLACE) {
          expect(current.node).toBeTruthy();
        } else if (current.type === ORDER) {
          expect(current.moves).toBeTruthy();
        } else if (current.type === PROP) {
          expect(current.props).toBeTruthy();
        } else if (current.type === TEXT) {
          expect(current.content).toBeTruthy();
        }
      });
    });
  });
});
