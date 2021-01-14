// base reducer - combines all the states
import {combineReducers} from 'redux'
import {persistReducer} from 'redux-persist'

// this is the localStorage object which are saving
import storage from 'redux-persist/lib/storage'

import mapperReducer from './mapper/mapper.reducer'

const persistConfig = {
  key: 'root', // we need to store from the root
  storage,
  //   whitelist: ["cart"],
}

// this return a giant object by combining all the slices
// keys are the slice of the redux store
const rootReducer = combineReducers({
  mapper: mapperReducer,
})

export default persistReducer(persistConfig, rootReducer)
