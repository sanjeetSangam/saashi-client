import { ADD_NOTIFY } from "./notificationAction";

const inital_data = {
  notifications: [],
};

export const notifyReducer = (store = inital_data, { type, payload }) => {
  if (type === ADD_NOTIFY) {
    return { ...store, notify: payload };
  } else {
    return store;
  }
};
