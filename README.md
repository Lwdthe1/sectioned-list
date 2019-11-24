A list of arrays with predefined max lengths.

Add to the list and items flow into sections.

- [Install](#install)
- [Usage](#usage)
- [Example](#example)
- [Tests](#tests)
- [Contributing](#contributing)

# Install

`npm install --save sectioned-list`

# Usage

- `new constructor(config)` Create a new instance with a config object.

- `addItem(<any>)` Adds an item to the next section that has space for it.

- `addItems(Array<any>)` Adds the items to the list by calling `addItem()` for each item in order.

- `sections` Get all sections in the list. A section's items can be accessed via its `items` field.

- `sectionedItems` Get an array of the items in the list in their section arrays. The returned value looks like this: `Array<Array<any>>`

See the tests (`tests/sectionedList_test.js`) to see how these methods are used.

## config object

When creating an instance, you can specify an optional configuration object with the following fields:

- `sectionSizes`

### sectionSizes: `Array<Number>`

You can specify an array of numbers to define the max size of your sections. If you don't specify this, it will default to `[10]`, which will give all your sections a max size of 10.

Say you provide the following array of section sizes: `[3, 5, 10]`. As you add items to the list, it will first create a section with the first 3 items, then another section with the next 5 items, and subsequent items will create subsequent sections of max-10 items. So, if you have 34 items to add to your sectioned list, the sections would look like this:

```
- 3 items
- 5 items
- 10 items
- 10 items
- 6 items
```

#### Empty sections

You can even specify empty sections by doing something like this: `[3, 5, 0, 10, 0, 20]`. `0` indicates an empty section.

Why would you do this? Perhaps you're using your sectioned list to display the items of the sections on a web page and want to use the empty sections to display advertisements.

So if you specify `[3, 5, 0, 10, 0, 20]` for your section sizes and use the empty sections to show advertisements, the web page would look something like this with 55 items:

```
- 3 items
- 5 items
- An advertisement
- 10 items
- Another advertisement
- 20 items
- 17 items
```

Note that if your last section size is empty, any subsequent sections will default to a max size of 10.

## Tests

We use mocha and chai. Run `npm test`

## Contributing

Feel free to open a pull request!
