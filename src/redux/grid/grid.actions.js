import GridActionTypes from './grid.types'

export const toggleShowErrors = () => ({
  type: GridActionTypes.TOGGLE_SHOW_ERRORS,
})

export const setRowHeight = (height) => ({
  type: GridActionTypes.SET_ROW_HEIGHT,
  payload: height,
})

export const setBreakpoint = (breakpoint) => ({
  type: GridActionTypes.SET_BREAKPOINT,
  payload: breakpoint,
})

export const setCompactTypes = (type) => ({
  type: GridActionTypes.SET_COMPACT_TYPE,
  payload: type,
})

export const setColBreakpoints = (breakpoints) => ({
  type: GridActionTypes.SET_COL_BREAKPOINTS,
  payload: breakpoints,
})

export const setElementSelected = (elem) => ({
  type: GridActionTypes.SET_ELEMENT_SELECTED,
  payload: elem,
})
