import { prop, propIn, identity } from "../src/js/support/util";

const assert = require("assert");

describe("prop", () => {
  const o = { foo: "banana" };
  const foo = prop("foo")(o);
  it("Returns a maybe", () => assert.equal(foo.toString(), "Just(banana)"));
  it("Resolves to the correct value", () =>
    assert.equal(foo.fold(undefined, identity), "banana"));
  it("Does not blow up when given a missing property", () =>
    assert.equal(prop("bar")(o).fold("missing!"), "missing!"));
});

describe("propIn", () => {
  const o = {
    fruit: {
      banana: {
        color: "yellow"
      },
      kiwi: {
        color: "green"
      }
    }
  };
  it("Returns a maybe", () =>
    assert.equal(
      propIn(["fruit", "banana", "color"])(o).toString(),
      "Just(yellow)"
    ));
  it("Does not blow up when given a missing property", () => {
    assert.equal(propIn(["foo", "bar", "baz"])(o).fold("missing!"), "missing!");
    assert.equal(propIn(["foo", "bar", "baz"])(o).toString(), "Nothing");
  });
  it("Resolves to the correct value", () =>
    assert.ok(
      propIn(["fruit", "banana", "color"])(o).fold(undefined, identity) ===
        "yellow" &&
        propIn(["fruit", "kiwi", "color"])(o).fold(undefined, identity) ===
          "green"
    ));
});
