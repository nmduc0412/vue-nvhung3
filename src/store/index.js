import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state: {
    count: "",
    userInfo : ""
  },
  mutations: {
    INCREMENT_COUNT(state, payload) {
      state.count += payload;
    },
    GET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
    },
  },
});

export default store;
