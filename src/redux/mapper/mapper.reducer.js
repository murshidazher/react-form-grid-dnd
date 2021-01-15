import {
  Number,
  Text,
  TextArea,
  Markdown,
  TextSuggest,
  Select,
  MultiSelect,
  Radios,
  DateComponent,
  Timestamp,
  Checkbox,
  Help,
  Array,
  FieldSet,
  TripleBoolean,
  Taxonomy,
} from '../../components/common/form'

const INITIAL_STATE = {
  elements: {
    number: Number,
    text: Text,
    password: Text,
    textarea: TextArea,
    markdown: Markdown,
    textsuggest: TextSuggest,
    select: Select,
    taxonomy: Taxonomy,
    radios: Radios,
    date: DateComponent,
    timestamp: Timestamp,
    checkbox: Checkbox,
    help: Help,
    array: Array,
    tBoolean: TripleBoolean,
    fieldset: FieldSet,
    tuple: FieldSet,
    multiselect: MultiSelect,
  },
  types: {
    Number: 'number',
    Textbox: 'text',
    Password: 'password',
    TextArea: 'textarea',
    Markdown: 'markdown',
    TextSuggest: 'textsuggest',
    Select: 'select',
    Taxonomy: 'taxonomy',
    Radios: 'radios',
    DateComponent: 'date',
    Timestamp: 'timestamp',
    Checkbox: 'checkbox',
    Help: 'help',
    Array: 'array',
    TripleBoolean: 'tBoolean',
    FieldSet: 'fieldset',
    Tuple: 'tuple',
    MultiSelect: 'multiselect',
  },
}

const mapperReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default mapperReducer
