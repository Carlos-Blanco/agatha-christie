import { createStore } from "vuex";

export default createStore({
  state: {
    readBooks: []
  },
  mutations: {
    ADD_BOOK_TO_COLLECTION(state, value){
      if (state.readBooks.includes(value) === false) state.readBooks.push(value);
    }
  },
  actions: {},
  modules: {}
});
