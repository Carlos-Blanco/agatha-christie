import { createStore } from "vuex";
import BookService from "@/services/BookService.js";

export default createStore({
  state: {
    user: [],
    userProfile: {
      readBooks: []
    },
    novels: [],
    trendingNovels: []
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
    SET_TRENDING_NOVELS(state, trendingNovels) {
      state.trendingNovels = trendingNovels;
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
    },
    fetchTrendingNovels({ commit }) {
      BookService.getNovels()
        .then(response => {
          var selectedNovels = [5, 21, 26, 9, 49, 14, 28, 38];
          var trendingNovels = [];
          var novels = response.data;
          for (var i = 0; i < selectedNovels.length; i++) {
            trendingNovels.push(novels[selectedNovels[i]])
          }
          commit("SET_TRENDING_NOVELS", trendingNovels);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  getters: {
    getTrendingNovels(state) {
      var selectednovels = [5, 21, 26, 9, 49, 14, 28, 38]
      var trendingnovels = []
      for (var i = 0; i < selectednovels.length; i++) {
        trendingnovels.push(state.novels[this.selectednovels[i]])
      }
      return trendingnovels;
    }
  }
});
