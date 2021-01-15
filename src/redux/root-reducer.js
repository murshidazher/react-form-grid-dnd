// base reducer - combines all the states
import {combineReducers} from 'redux'
import {persistReducer} from 'redux-persist'

// this is the localStorage object which are saving
import storage from 'redux-persist/lib/storage'

import mapperReducer from './mapper/mapper.reducer'
import gridReducer from './grid/grid.reducer'
import formReducer from './form/form.reducer'

const persistConfig = {
  key: 'root', // we need to store from the root
  storage,
  blacklist: ['mapper', 'form'],
  whitelist: ['grid'],
}

// this return a giant object by combining all the slices
// keys are the slice of the redux store
const rootReducer = combineReducers({
  mapper: mapperReducer,
  grid: gridReducer,
  form: formReducer,
})

export default persistReducer(persistConfig, rootReducer)
