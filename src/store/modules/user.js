import firebase from "firebase";
import router from "@/router/index";
require("firebase/auth");
require("firebase/firestore");

export const state = {
  user: {
    userinfo: "",
    readBooks: []
  }
};

export const mutations = {
  ADD_USER(state, value) {
    state.user.userinfo = value;
  },
  UPDATE_BOOKS(state, value) {
    state.user.readBooks = value;
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
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.firestore();
        if (state.user.readBooks.includes(value)){
          const index = state.user.readBooks.indexOf(value);
          if (index > -1) {
            commit("REMOVE_BOOK", index);
            db.collection("users").doc(state.user.userinfo).update({books: firebase.firestore.FieldValue.arrayRemove(value)})
          }
        } else {
          commit("ADD_BOOK", value);
          db.collection("users").doc(state.user.userinfo).update({books: firebase.firestore.FieldValue.arrayUnion(value)})
        }
      } else {
        // No user is signed in.
        router.push({ name: "Signup"})
      }
    });
  },
  signup({ commit }, value) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(value.email, value.password)
      .then(user => {
        const db = firebase.firestore()
        const userEmail = { email: value.email };
        db.collection("users").doc(user.user.uid).set(userEmail);
        commit("ADD_USER", user.user.uid);
        router.push({ name: "Home" });
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
        commit("ADD_USER", user.user.uid);
        router.push({ name: "Home" });
      })
      .catch(error => {
        var errorMessage = error.message;
        var signupError = document.getElementById("errorMessage");
        signupError.style.display = "block";
        signupError.textContent += errorMessage;
      });
  },
  checkAuth({ commit }) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const db = firebase.firestore()
        var userRef = db.collection("users").doc(user.uid);
        userRef.get().then(function(doc) {
            if (doc.exists) {
              var books = doc.data();
              var readBooks = books.books;
              commit("UPDATE_BOOKS", readBooks);
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });
        commit("ADD_USER", user.uid);
      } else {
        // No user is signed in.
      }
    });
  },
  getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  }
};
