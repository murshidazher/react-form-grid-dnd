import {all, call} from 'redux-saga/effects'
import {formSagas} from './form/form.sagas'

export default function* rootSaga() {
  yield all([call(formSagas)])
}
