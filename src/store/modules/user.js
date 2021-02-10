import firebase from "firebase";
require("firebase/auth");
require("firebase/firestore");

export const state = {
  user: {
    userinfo: [],
    readBooks: []
  }
};

export const mutations = {
  ADD_USER(state, value) {
    state.user.userinfo.push(value);
  },
  ADD_BOOK(state, value) {
    state.user.readBooks.push(value);
  },
  REMOVE_BOOK(state, index) {
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
  },
  signup({ commit }, value) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(value.email, value.password)
      .then(user => {
        const db = firebase.firestore()
        const userEmail = { email: value.email };
        console.log(user.user.uid);
        db.collection("users").doc(user.user.uid).set(userEmail);
        commit("ADD_USER", value);
      })
      .catch(error => {
        var errorMessage = error.message;
        var signupError = document.getElementById("errorMessage");
        signupError.style.display = "block";
        signupError.textContent += errorMessage;
      });
  },
  login({ commit }, value) {
    firebase
      .auth()
      .signInWithEmailAndPassword(value.email, value.password)
      .then(user => {
        console.log(user);
        commit("ADD_USER", value);
      })
      .catch(error => {
        var errorMessage = error.message;
        var signupError = document.getElementById("errorMessage");
        signupError.style.display = "block";
        signupError.textContent += errorMessage;
      });
  }
};
