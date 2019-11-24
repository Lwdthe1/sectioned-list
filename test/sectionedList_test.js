"use stict";

const { assert } = require("chai");

const SectionedList = require("../index");
const testHelper = require("./TestHelper").instance();

describe("constructor", () => {
  it("should construct a new sectional array with provided section defintions", () => {
    const defs = [3, 10, 10, 5, 5, 10];
    const sectional = new SectionedList({ sectionSizes: defs });
    assert.deepEqual(sectional.sections, []);
    assert.deepEqual(sectional.defs, defs);

    // Should have copied the defs array into another array
    assert.isFalse(sectional.defs === defs);
  });

  it("should construct a new sectional array with default props", () => {
    const sectional = new SectionedList();
    assert.deepEqual(sectional.sections, []);
    assert.deepEqual(sectional.defs, [10]);
  });
});

describe("#addItem()", () => {
  it("should create first section and add item onto it when no sections exist yet", () => {
    const sectional = new SectionedList();

    const item = { name: "Lincoln" };
    sectional.addItem(item);

    assert.deepEqual(sectional.getLastSection().items, [item]);
  });
});

describe("#addItems()", () => {
  it("should add items into sections in order when using default section defs", () => {
    const sectional = new SectionedList();

    const items = [...Array(23).keys()];
    sectional.addItems(items);

    assert.deepEqual(sectional.sectionedItems, [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      [20, 21, 22]
    ]);
  });

  it("should add items into sections in order when using custom section defs and ensure sections are well formed.", () => {
    const sectionSizes = [3, 5, 10, 20];
    const sectional = new SectionedList({ sectionSizes });

    const items = [...Array(76).keys()];
    sectional.addItems(items);

    // Ensure the items were pushed into the custom sections correctly
    assert.deepEqual(sectional.sectionedItems, [
      [0, 1, 2],
      [3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      [
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37
      ],
      [
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57
      ],
      [58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75]
    ]);

    // Ensure the sections are well formed.
    assert.deepEqual(
      sectional.sections.map(({ index, prev, next, size, maxSize }) => ({
        index,
        prevIndex: prev ? prev.index : undefined,
        nextIndex: next ? next.index : undefined,
        size,
        maxSize
      })),
      [
        {
          index: 0,
          prevIndex: undefined,
          nextIndex: 1,
          size: 3,
          maxSize: 3
        },
        { index: 1, prevIndex: 0, nextIndex: 2, size: 5, maxSize: 5 },
        { index: 2, prevIndex: 1, nextIndex: 3, size: 10, maxSize: 10 },
        { index: 3, prevIndex: 2, nextIndex: 4, size: 20, maxSize: 20 },
        { index: 4, prevIndex: 3, nextIndex: 5, size: 20, maxSize: 20 },
        {
          index: 5,
          prevIndex: 4,
          nextIndex: undefined,
          size: 18,
          maxSize: 20
        }
      ]
    );
  });

  it("should add items into sections in order when using custom section defs with 2 empty defs and empty as last", () => {
    const sectionSizes = [3, 5, 0, 15, 0];
    const sectional = new SectionedList({ sectionSizes });

    const items = [...Array(59).keys()];
    sectional.addItems(items);

    assert.deepEqual(sectional.sectionedItems, [
      [0, 1, 2],
      [3, 4, 5, 6, 7],
      [],
      [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      [],
      [25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
      [35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
      [45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
      [55, 56, 57, 58]
    ]);

    assert.deepEqual(
      sectional.sections.map(({ size, maxSize }) => `${size} / ${maxSize}`),
      [
        "3 / 3",
        "5 / 5",
        "0 / 0",
        "15 / 15",
        "0 / 0",
        // After the last def, which is empty, should default following defs to 10
        "10 / 10",
        "10 / 10",
        "10 / 10",
        "4 / 10"
      ]
    );
  });

  it("should add items into sections in order when using custom section defs with 2 empty defs", () => {
    const sectionSizes = [3, 5, 0, 15, 0, 21];
    const sectional = new SectionedList({ sectionSizes });

    const items = [...Array(59).keys()];
    sectional.addItems(items);

    assert.deepEqual(sectional.sectionedItems, [
      [0, 1, 2],
      [3, 4, 5, 6, 7],
      [],
      [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      [],
      [
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45
      ],
      [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58]
    ]);

    assert.deepEqual(
      sectional.sections.map(({ size, maxSize }) => `${size} / ${maxSize}`),
      ["3 / 3", "5 / 5", "0 / 0", "15 / 15", "0 / 0", "21 / 21", "13 / 21"]
    );
  });
});
