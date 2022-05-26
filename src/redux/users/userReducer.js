import { ADD_USER } from "./userAction";

const inital_data = {
  user: {},
};

export const userReducer = (store = inital_data, { type, payload }) => {
  if (type === ADD_USER) {
    return { ...store, user: payload };
  } else {
    return store;
  }
};
