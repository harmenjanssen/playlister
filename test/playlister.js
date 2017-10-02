import { removeCruftFromTrack } from "../src/js/playlister";

const assert = require("assert");

describe("removeCruftFromTrack", () => {
  const milesFixture = "Miles Davis - Freddie Freeloader";
  const royFixture = "Roy Ayers - Running Away";

  const test = (input, fixture) => assert.equal(removeCruftFromTrack(input), fixture);

  it("Recognizes a simple artist - track string", () =>
    test("Miles Davis - Freddie Freeloader", milesFixture));

  it("Should do so regardless of whitespace", () =>
    test("  Miles Davis\t-\tFreddie Freeloader ", milesFixture));

  it("Should ignore track numbers", () =>
    test("03. Miles Davis - Freddie Freeloader", milesFixture));

  it("Should ignore differently formatted numbers", () =>
    test("3 Miles Davis - Freddie Freeloader", milesFixture));

  it("Should seriously ignore all track numbers", () =>
    test("[03] Miles Davis - Freddie Freeloader", milesFixture));

  it("Should strip off anything trailing in brackets", () =>
    test("Miles Davis - Freddie Freeloader [Blue Note]", milesFixture));

  it("Should strip off anything trailing in parentheses", () =>
    test("Miles Davis - Freddie Freeloader (Blue Note, 1959)", milesFixture));

  it("Should not get confused by dashes within brackets", () =>
    test("Roy Ayers - Running Away [Strictly Breaks - SB 9802]", royFixture));
});
