import {takeLatest, call, put, all, select} from 'redux-saga/effects'

import {
  fetchFormSuccess,
  fetchFormFailure,
  setForm,
  setLayouts,
  setModel,
  setSchema,
} from './form.actions'

import formsApi from '../../api/forms'

import FormActionTypes from './form.types'

import {selectFormSelected} from './form.selectors'

// sagas will be listening to them
export function* fetchFormAsync() {
  try {
    const uri = yield select(selectFormSelected)
    const response = yield formsApi.getForm(`/${uri}`)

    if (response.ok) {
      const {form, schema, model, layout} = response.data

      yield put(fetchFormSuccess())
      yield put(setForm(form))
      yield put(setModel(model))
      yield put(setLayouts(layout))
      yield put(setSchema(schema))
    } else {
      yield put(fetchFormFailure(response.problem))
    }
  } catch (error) {
    yield put(fetchFormFailure(error.message))
  }
}

export function* fetchFormStart() {
  yield takeLatest(FormActionTypes.FETCH_FORM_START, fetchFormAsync)
}

export function* formSagas() {
  yield all([call(fetchFormStart)])
}
