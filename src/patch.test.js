const { patch } = require("./patch");

describe("patch", () => {
  it("修改props", () => {
    const div = document.createElement("div");
    div.setAttribute("class", "blue");
    patch(div, {
      0: [{ type: 2, props: { class: "red" } }]
    });
    expect(div.getAttribute("class")).toBe("red");
  });

  it("修改textContent", () => {
    const div = document.createElement("div");
    div.setAttribute("class", "blue");
    patch(div, {
      0: [{ type: 3, content: "new content" }]
    });
    expect(div.textContent).toBe("new content");
  });

  it("替换节点", done => {
    const div = document.createElement("div");
    div.setAttribute("class", "blue");
    div.textContent = "Hello";

    document.body.appendChild(div);
    patch(div, {
      0: [
        {
          type: 0,
          node: {
            props: {
              className: "red"
            },
            type: "div"
          }
        }
      ]
    });
    expect(document.querySelector(".red")).not.toBeFalsy();

    setTimeout(() => {
      if (!document.querySelector(".blue")) {
        done();
      } else {
        console.log(document.body.innerHTML);
        done("出错");
      }
    }, 3000);
  });

  it("修改子元素", () => {
    const ul = document.createElement("ul");
    document.body.appendChild(ul);

    const li1 = document.createElement("li");
    ul.appendChild(li1);
    const li2 = document.createElement("li");
    ul.appendChild(li2);
    const li3 = document.createElement("li");
    ul.appendChild(li3);

    patch(ul, {
      0: [
        {
          type: 1,
          moves: [{ type: 0, index: 1 }]
        }
      ]
    });
    expect(ul.childNodes.length).toBe(2);

    patch(ul, {
      0: [
        {
          type: 1,
          moves: [{ type: 1, index: 1, item: "hello world~" }]
        }
      ]
    });

    expect(ul.childNodes.length).toBe(3);

    expect(ul.childNodes[1].nodeValue).toBe("hello world~");
  });
});
