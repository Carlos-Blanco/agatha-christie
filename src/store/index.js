import { createStore } from "vuex";

export default createStore({
  state: {
    userProfile: {
      readBooks: []
    }
  },
  mutations: {
    ADD_BOOK_TO_COLLECTION(state, value){
      if (state.userProfile.readBooks.includes(value)){
        const index = state.userProfile.readBooks.indexOf(value);
        if (index > -1) {
          state.userProfile.readBooks.splice(index, 1);
        }
      } else {
        state.userProfile.readBooks.push(value);
      }
    }
  },
  actions: {},
  modules: {}
});
