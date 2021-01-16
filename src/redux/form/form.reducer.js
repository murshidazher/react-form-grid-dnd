import FormActionTypes from './form.types'
import {
  setNewBreakpointLayout,
  addNewElementToForm,
  addNewPropertyToSchema,
  removeElementFromLayoutBreakpoint,
} from './form.utils'

const INITIAL_STATE = {
  selected: 'login.json',
  form: [], // ui of the form
  model: {}, // values of the form
  layouts: {}, // grid changing layouts
  schema: {}, // attributes of form -  - for form element generation
  isFetching: false,
  fetchErrorMessage: undefined,
}

const formReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FormActionTypes.SET_SELECTED:
      return {
        ...state,
        selected: action.payload,
      }
    case FormActionTypes.FETCH_FORM_START:
      return {
        ...state,
        isFetching: true,
      }
    case FormActionTypes.FETCH_FORM_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }
    case FormActionTypes.FETCH_FORM_FAILURE:
      return {
        ...state,
        isFetching: false,
        fetchErrorMessage: action.payload,
      }
    case FormActionTypes.SET_FORM:
      return {
        ...state,
        form: action.payload,
      }
    case FormActionTypes.SET_MODEL:
      return {
        ...state,
        model: action.payload || {},
      }
    case FormActionTypes.SET_LAYOUTS:
      return {
        ...state,
        layouts: action.payload,
      }
    case FormActionTypes.SET_SCHEMA:
      return {
        ...state,
        schema: action.payload,
      }
    case FormActionTypes.TOGGLE_CART_HIDDEN:
      return {
        ...state,
        hidden: !state.hidden,
      }
    case FormActionTypes.SET_BREAKPOINT_LAYOUT:
      return setNewBreakpointLayout(
        state,
        action.payload.breakpoint,
        action.payload.layout
      )
    case FormActionTypes.ADD_FORM_ELEMENT:
      return {
        ...state,
        form: addNewElementToForm(state.form, action.payload),
      }
    case FormActionTypes.ADD_SCHEMA_PROPERTY:
      return {
        ...state,
        schema: addNewPropertyToSchema(
          state.schema,
          action.payload.key,
          action.payload.property
        ),
      }
    case FormActionTypes.REMOVE_LAYOUT_ELEMENT:
      return removeElementFromLayoutBreakpoint(
        state,
        action.payload.breakpoint,
        action.payload.key,
        action.payload.idx
      )
    case FormActionTypes.CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      }
    default:
      return state
  }
}

export default formReducer
