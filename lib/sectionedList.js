"use strict";

class SectionedList {
  constructor({ sectionSizes } = {}) {
    this._sections = [];
    this._defs = sectionSizes ? [...sectionSizes] : [10];
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

  get defs() {
    return this._defs;
  }

  get numDefs() {
    return this.defs.length;
  }

  get lastDef() {
    return this.defs[this.numDefs - 1];
  }

  getLastSection() {
    let section = this._sections[this.lastSectionIndex];

    if (!section) {
      section = this._createNextSection();
    }

    return section;
  }

  getSectionDefAtIndex(index) {
    let def = this.defs[index];

    if (def == undefined) {
      def = !!this.lastDef ? this.lastDef : 10;
    }

    return def;
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
      maxSize: this.getSectionDefAtIndex(index)
    });

    if (prev) {
      prev.setNextSection(nextSection);
    }

    this._pushSection(nextSection);

    return nextSection;
  }

  addItem(item) {
    let section = this.getLastSection();
    if (section.hasSpace) {
      section.addItem(item);
    } else {
      // Create the next section
      const nextSection = this._createNextSection();

      nextSection.addItem(item);
    }
  }

  addItems(items) {
    items.forEach(this.addItem.bind(this));
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
