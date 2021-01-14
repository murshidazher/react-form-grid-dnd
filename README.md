# [react-form-grid-dnd](https://github.com/murshidazher/react-form-grid-dnd)

> :warning: [experimental] [ongoing] drag grid

- A basic plugin based dynamic form generation with schema and validations

## Table of Contents

- [react-form-grid-dnd](#react-form-grid-dnd)
  - [Table of Contents](#table-of-contents)
  - [Structure](#structure)
  - [TODO](#todo)
  - [Tools](#tools)
  - [License](#license)


## Structure

All components that listen to Redux store changes should go in the `/containers` directory. All others belong in the `/components` directory.

`/helpers` contains `hoc`.

## TODO

- [ ] Look for all demos in [STRML/react-grid-layout](https://github.com/STRML/react-grid-layout#demos)
- [ ] Do a code review to understand the library
- [ ] Create a basic form structure
- [ ] Create a basic form schema structure. Refer to [this doc](https://github.com/json-schema-form/json-schema-form/wiki/Documentation)
- [ ] Create an element form and schema structure
- [ ] Show component properties to the elements
- [ ] On Drag, create a new layout inside the layout builder
- [ ] Drag and drop elements
- [ ] Drag and drop elements to the box. Look into [React dnd](https://react-dnd.github.io/react-dnd/examples/other/native-files)
- [ ] On drop add element to the form structure
- [ ] Add element to the schema structure
- [ ] Create form element components
- [ ] Change the state to redux saga
- [ ] Refactor: change the class components to stateless components
- [ ] Refactor: remove unused packages
- [ ] Refactor: change the drag source box to use native drag elements and remove react dnd
- [ ] Create custom resize handle
- [ ] useMemo to memoize the grid for [better performance](https://github.com/STRML/react-grid-layout#performance)
- [ ] Add Styling
- [ ] [Drag from Outside](https://strml.github.io/react-grid-layout/examples/15-drag-from-outside.html)
- [ ] [Add Dynamic Add and Remove](https://strml.github.io/react-grid-layout/examples/6-dynamic-add-remove.html)
- [ ] [Remove and Rearrange - toolbox](https://strml.github.io/react-grid-layout/examples/14-toolbox.html)
- [ ] [Localstorage](https://strml.github.io/react-grid-layout/examples/7-localstorage.html)

## Tools

- [Immer](https://immerjs.github.io/immer/docs/update-patterns)

## License

[MIT](https://github.com/murshidazher/react-form-grid-dnd/blob/master/LICENSE) © Murshid Azher.
