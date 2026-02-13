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
    return BookService.getNovels()
      .then(response => {
        commit("SET_NOVELS", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  fetchTrendingNovels({ commit, state }) {
    if (state.novels.length > 0) {
      const selectedNovelsIds = [6, 11, 20, 24, 28, 33, 36, 38, 47, 48, 57];
      const trendingNovels = state.novels.filter((novel, index) => selectedNovelsIds.includes(index));
      commit("SET_TRENDING_NOVELS", trendingNovels);
      return Promise.resolve();
    }

    return BookService.getNovels()
      .then(response => {
        const selectedNovelsIds = [6, 11, 20, 24, 28, 33, 36, 38, 47, 48, 57];
        const trendingNovels = response.data.filter((novel, index) => selectedNovelsIds.includes(index));
        commit("SET_TRENDING_NOVELS", trendingNovels);
      })
      .catch(error => {
        console.error("Error fetching trending novels:", error);
      });
  }
}
