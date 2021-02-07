import { createStore } from "vuex";
import BookService from "@/services/BookService.js";

export default createStore({
  state: {
    user: [],
    userProfile: {
      readBooks: []
    },
    novels: []
  },
  mutations: {
    ADD_BOOK(state, value){
      state.userProfile.readBooks.push(value);
    },
    REMOVE_BOOK(state, index){
      state.userProfile.readBooks.splice(index, 1);
    },
    SET_NOVELS(state, novels) {
      state.novels = novels;
    },
    SET_USER(state, user){
      state.user = user;
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
    },
    fetchNovels({ commit }) {
      BookService.getNovels()
        .then(response => {
          commit("SET_NOVELS", response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
});
