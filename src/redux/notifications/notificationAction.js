export const ADD_NOTIFY = "ADD_NOTIFY";

export const addNotify = (payload) => {
  return {
    type: ADD_NOTIFY,
    payload,
  };
};
