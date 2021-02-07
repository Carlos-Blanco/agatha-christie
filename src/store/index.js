import { createStore } from "vuex";

export default createStore({
  state: {
    userProfile: {
      readBooks: []
    }
  },
  mutations: {
    ADD_BOOK(state, value){
      state.userProfile.readBooks.push(value);
    },
    REMOVE_BOOK(state, index){
      state.userProfile.readBooks.splice(index, 1);
    }
  },
  actions: {
    updateBook({ state, commit }, value){
      if (state.userProfile.readBooks.includes(value)){
        const index = state.userProfile.readBooks.indexOf(value);
        if (index > -1) {
          commit("REMOVE_BOOK", index);
        }
      } else {
        commit("ADD_BOOK", value);
      }
    }
  },
  modules: {}
});
