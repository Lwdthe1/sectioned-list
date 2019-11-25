"use strict";

class SectionedList {
  constructor({ sectionSizes } = {}) {
    this._sections = [];
    this._specs = sectionSizes ? [...sectionSizes] : [10];
  }

  get sections() {
    return this._sections;
  }

  get sectionedItems() {
    return this.sections.map(section => section.items);
  }

  get numSections() {
    return this._sections.length;
  }

  get lastSectionIndex() {
    return this.numSections - 1;
  }

  get numSectionSizeSpecs() {
    return this._specs.length;
  }

  get lastSectionSpec() {
    return this._specs[this.numSectionSizeSpecs - 1];
  }

  getLastSection() {
    let section = this._sections[this.lastSectionIndex];

    if (!section) {
      section = this._createNextSection();
    }

    return section;
  }

  getSectionSpecAtIndex(index) {
    let def = this._specs[index];

    if (def == undefined) {
      def = !!this.lastSectionSpec ? this.lastSectionSpec : 10;
    }

    return def;
  }

  /**
   * Add an item to the next section that has space for it.
   * @param {any} item
   */
  addItem(item) {
    let section = this.getLastSection();
    if (section.hasSpace) {
      section.addItem(item);
    } else {
      // Create the next section
      this._createNextSection();

      // Recurse
      this.addItem(item);
    }
  }

  /**
   * Adds the items to the list in order.
   * @param {Array<any>} items
   */
  addItems(items) {
    items.forEach(this.addItem.bind(this));
  }

  /**
   * Add a section size specification to the list.
   * @param {Number} length
   */
  addSectionSize(length) {
    this._specs.push(length);
  }

  _pushSection(section) {
    this._sections.push(section);
    return section;
  }

  _createNextSection() {
    const index = this.lastSectionIndex + 1;
    const prev = index > 0 ? this.getLastSection() : undefined;

    const nextSection = new Section({
      index,
      prev,
      maxSize: this.getSectionSpecAtIndex(index)
    });

    if (prev) {
      prev.setNextSection(nextSection);
    }

    this._pushSection(nextSection);

    return nextSection;
  }
}

class Section {
  constructor({ index, prev, maxSize }) {
    this._index = index;
    this._prevSection = prev;
    this._nextSection = undefined;

    this._items = [];
    this._maxSize = maxSize;
  }

  get index() {
    return this._index;
  }

  get prev() {
    return this._prevSection;
  }

  get next() {
    return this._nextSection;
  }

  get items() {
    return this._items;
  }

  get size() {
    return this.items.length;
  }

  get maxSize() {
    return this._maxSize;
  }

  get hasSpace() {
    return this.size < this.maxSize;
  }

  setNextSection(section) {
    if (this._nextSection) {
      return;
    }
    this._nextSection = section;
  }

  addItem(item) {
    if (!this.hasSpace) {
      return -1;
    }

    this._items.push(item);
    return this.size - 1;
  }
}

module.exports = SectionedList;
