import { combineReducers, legacy_createStore as createStore } from "redux";
import { userReducer } from "./users/userReducer";
import { notifyReducer } from "./notifications/notificationReducer";

const mainReducer = combineReducers({
  userReducer,
  notifyReducer,
});

export const store = createStore(
  mainReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
