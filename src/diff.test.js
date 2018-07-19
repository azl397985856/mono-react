function testDiff() {
  const vdom = {
    type: "div",
    props: {},
    children: []
  };

  const ovdom = {
    type: "div",
    props: {},
    children: []
  };

  diff(vdom, ovdom);
}

testDiff();
