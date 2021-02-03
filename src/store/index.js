import { createStore } from "vuex";

export default createStore({
  state: {
    readBooks: []
  },
  mutations: {
    ADD_BOOK_TO_COLLECTION(state, value){
      state.readBooks.push(value);
    }
  },
  actions: {},
  modules: {}
});
