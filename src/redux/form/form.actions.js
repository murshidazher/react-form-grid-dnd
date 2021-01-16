import FormActionTypes from './form.types'

import formsApi from '../../api/forms'

export const setSelected = (uri) => ({
  type: FormActionTypes.SET_SELECTED,
  payload: uri,
})

export const setForm = (form) => ({
  type: FormActionTypes.SET_FORM,
  payload: form,
})

export const setModel = (model) => ({
  type: FormActionTypes.SET_MODEL,
  payload: model,
})

export const setSchema = (schema) => ({
  type: FormActionTypes.SET_SCHEMA,
  payload: schema,
})

export const setLayouts = (layouts) => ({
  type: FormActionTypes.SET_LAYOUTS,
  payload: layouts,
})

export const setBreakpointLayout = (breakpoint, layout) => ({
  type: FormActionTypes.SET_BREAKPOINT_LAYOUT,
  payload: {
    breakpoint: breakpoint,
    layout: layout,
  },
})

export const removeElementFromLayoutBreakpoint = (breakpoint, key, idx) => ({
  type: FormActionTypes.REMOVE_LAYOUT_ELEMENT,
  payload: {
    breakpoint: breakpoint,
    key: key,
    idx: idx,
  },
})

export const addNewElementToForm = (key) => ({
  type: FormActionTypes.ADD_FORM_ELEMENT,
  payload: key,
})

export const addNewPropertyToSchema = (key, property) => ({
  type: FormActionTypes.ADD_SCHEMA_PROPERTY,
  payload: {
    key: key,
    property: property,
  },
})

export const fetchFormStart = () => ({
  type: FormActionTypes.FETCH_FORM_START,
})

export const fetchFormSuccess = () => ({
  type: FormActionTypes.FETCH_FORM_SUCCESS,
})

export const fetchFormFailure = (fetchErrorMessage) => ({
  type: FormActionTypes.FETCH_FORM_FAILURE,
  payload: fetchErrorMessage,
})

export const fetchFormStartAsync = () => {
  return (dispatch, state) => {
    const response = formsApi.getForm(`/${uri}`)

    dispatch(fetchFormStart())

    if (response.ok) {
      const {form, schema, model, layouts} = response.data

      dispatch(fetchFormSuccess())
      dispatch(setForm(form))
      dispatch(setModel(model))
      dispatch(setLayouts(layouts))
      dispatch(setSchema(schema))
    } else {
      dispatch(fetchFormFailure(response.problem))
    }
  }
}
