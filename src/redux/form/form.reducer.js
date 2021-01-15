import FormActionTypes from './form.types'
import {addItemToForm, removeItemFromForm} from './form.utils'

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
    case FormActionTypes.ADD_ITEM:
      return {
        ...state,
        cartItems: addItemToCart(state.cartItems, action.payload),
      }
    case FormActionTypes.REMOVE_ITEM:
      return {
        ...state,
        cartItems: removeItemFromCart(state.cartItems, action.payload),
      }
    case FormActionTypes.CLEAR_ITEM_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (cartItem) => cartItem.id !== action.payload.id,
        ),
      }
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
