import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userLoginReducer from './slices/userLoginSlice';
import userSignUpReducer from './slices/userSignUpSlice';
import diamondSlice from './slices/diamondSlice'; 
import materialSlice from './slices/materialSlice';
import shellSlice from './slices/shellSlice';
import * as selectors from './selectors';

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['product'], // Ensure 'product' is persisted if needed
};

const rootReducer = combineReducers({
  userLogin: userLoginReducer,
  userSignUp: userSignUpReducer,
  diamonds: diamondSlice,
  materials: materialSlice,
  shells: shellSlice // Add shellSlice to rootReducer
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

// Optional: Add thunk middleware for handling async actions
const middleware = (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false, // Disable serializable check for now
  });

export const store = configureStore({
  reducer: persistedReducer,
  middleware,
});

export const persistor = persistStore(store);

export { selectors };

export default store;
