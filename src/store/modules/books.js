import BookService from "@/services/BookService.js";

export const state = {
  novels: [],
  trendingNovels: []
}

export const mutations = {
  SET_NOVELS(state, novels) {
    state.novels = novels;
  },
  SET_TRENDING_NOVELS(state, trendingNovels) {
    state.trendingNovels = trendingNovels;
  }
}

export const actions = {
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
        var selectedNovels = [6, 11, 20, 24, 28, 33, 36, 38, 47, 48, 57];
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
}
