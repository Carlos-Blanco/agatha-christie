import { createStore } from "vuex";

export default createStore({
  state: {
    readBooks: []
  },
  mutations: {
    ADD_BOOK_TO_COLLECTION(state, value){
      if (state.readBooks.includes(value)){
        const index = state.readBooks.indexOf(value);
        if (index > -1) {
          state.readBooks.splice(index, 1);
        }
      } else {
        state.readBooks.push(value);
      }
    }
  },
  actions: {},
  modules: {}
});
