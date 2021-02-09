export const state = {
  user: {
    readBooks: []
  }
};

export const mutations = {
  ADD_BOOK(state, value){
    state.user.readBooks.push(value);
  },
  REMOVE_BOOK(state, index){
    state.user.readBooks.splice(index, 1);
  }
};

export const actions = {
  updateBook({ state, commit }, value){
    if (state.user.readBooks.includes(value)){
      const index = state.user.readBooks.indexOf(value);
      if (index > -1) {
        commit("REMOVE_BOOK", index);
      }
    } else {
      commit("ADD_BOOK", value);
    }
  }
};
