export default createStore({
  state: {
    novels: [],
    trendingNovels: []
  },
  mutations: {
    SET_NOVELS(state, novels) {
      state.novels = novels;
    },
    SET_TRENDING_NOVELS(state, trendingNovels) {
      state.trendingNovels = trendingNovels;
    }
  },
  actions: {
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