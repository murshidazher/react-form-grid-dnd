import GridActionTypes from './grid.types'

const INITIAL_STATE = {
  rowHeight: 30,
  breakpoint: 'sm',
  compactType: 'vertical',
  elemSelected: '',
  lastDroppedElement: '',
  cols: {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2,
  },
  localization: undefined,
  showErrors: false,
}

const gridReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GridActionTypes.TOGGLE_SHOW_ERRORS:
      return {
        ...state,
        showErrors: !state.showErrors,
      }
    case GridActionTypes.SET_ROW_HEIGHT:
      return {
        ...state,
        rowHeight: action.payload,
      }
    case GridActionTypes.SET_BREAKPOINT:
      return {
        ...state,
        breakpoint: action.payload,
      }
    case GridActionTypes.SET_COMPACT_TYPE:
      return {
        ...state,
        compactType: action.payload,
      }
    case GridActionTypes.SET_COL_BREAKPOINTS:
      return {
        ...state,
        cols: action.payload,
      }
    case GridActionTypes.SET_ELEMENT_SELECTED:
      return {
        ...state,
        elemSelected: action.payload,
      }
    case GridActionTypes.SET_LAST_DROPPED_ELEMENT:
      return {
        ...state,
        lastDroppedElement: action.payload,
      }
    default:
      return state
  }
}

export default gridReducer
