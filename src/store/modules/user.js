import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import router from "@/router/index";

export const state = {
  user: {
    userinfo: "",
    readBooks: [],
    authError: null
  },
  unsubscribeAuthInfo: null // Store unsubscribe function
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
  },
  SET_AUTH_ERROR(state, error) {
    state.user.authError = error;
  },
  CLEAR_AUTH_ERROR(state) {
    state.user.authError = null;
  },
  SET_UNSUBSCRIBE(state, unsubscribe) {
    state.unsubscribeAuthInfo = unsubscribe;
  }
};

export const actions = {
  updateBook({ state, commit }, value) {
    const user = firebase.auth().currentUser;
    if (user) {
      const db = firebase.firestore();

      if (state.user.readBooks.includes(value)) {
        const index = state.user.readBooks.indexOf(value);
        if (index > -1) {
          commit("REMOVE_BOOK", index);
          db.collection("users").doc(user.uid).update({ books: firebase.firestore.FieldValue.arrayRemove(value) })
        }
      } else {
        commit("ADD_BOOK", value);
        db.collection("users").doc(user.uid).update({ books: firebase.firestore.FieldValue.arrayUnion(value) })
      }
    } else {
      // No user is signed in.
      router.push({ name: "SignUp" })
    }
  },
  saveRating({ state }, { slug, rating }) {
    const user = firebase.auth().currentUser;
    if (user) {
      const db = firebase.firestore();
      return db.collection("rating")
        .doc(slug)
        .collection("users")
        .doc(user.uid)
        .set({ bookrate: rating });
    }
  },
  removeRating({ state }, slug) {
    const user = firebase.auth().currentUser;
    if (user) {
      const db = firebase.firestore();
      return db.collection("rating")
        .doc(slug)
        .collection("users")
        .doc(user.uid)
        .delete();
    }
  },
  signup({ commit }, value) {
    commit("CLEAR_AUTH_ERROR");
    firebase
      .auth()
      .createUserWithEmailAndPassword(value.email, value.password)
      .then(user => {
        const db = firebase.firestore()
        db.collection("users").doc(user.user.uid).set({ books: ([]) });
        commit("ADD_USER", user.user.uid);
        router.push({ name: "Home" });
      })
      .catch(error => {
        commit("SET_AUTH_ERROR", error.message);
      });
  },
  login({ commit }, value) {
    commit("CLEAR_AUTH_ERROR");
    firebase
      .auth()
      .signInWithEmailAndPassword(value.email, value.password)
      .then(user => {
        commit("ADD_USER", user.user.uid);
        router.push({ name: "Home" });
      })
      .catch(error => {
        commit("SET_AUTH_ERROR", error.message);
      });
  },
  logout({ commit, state }) {
    firebase.auth().signOut().then(() => {
      // Unsubscribe from user info listener if it exists
      if (state.unsubscribeAuthInfo) {
        state.unsubscribeAuthInfo();
        commit("SET_UNSUBSCRIBE", null);
      }
      commit("ADD_USER", "");
      commit("UPDATE_BOOKS", []);
      commit("CLEAR_AUTH_ERROR");
      router.push({ name: "Home" });
    }).catch((error) => {
      commit("SET_AUTH_ERROR", error.message);
    });
  },
  checkAuth({ commit, state }) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // If we already have a listener, don't create another one unless uid changed (simplified here to just check existence)
        // Ideally we might want to unsub previous if user changed, but onAuthStateChanged handles session persistence.
        // However, we want to listen to FIRESTORE changes for the user's books if multiple tabs or remote updates happen.
        // The original code used .get() which is one-time. If we want real-time, we use onSnapshot.

        // Let's stick to the original intent of fetching data but fix the potential duplication or lack of cleanup.
        // The original code did `userRef.get()`. This is fine, but it was inside `onAuthStateChanged`.
        // This is actually correct for `checkAuth` (session persistence), it runs when auth state is restored.

        commit("ADD_USER", user.uid);

        const db = firebase.firestore()
        var userRef = db.collection("users").doc(user.uid);

        // Using onSnapshot for real-time updates of books list
        // And storing unsubscribe to clean it up on logout
        if (!state.unsubscribeAuthInfo) {
          const unsubscribe = userRef.onSnapshot((doc) => {
            if (doc.exists) {
              var books = doc.data();
              var readBooks = books.books;
              commit("UPDATE_BOOKS", readBooks);
            }
          }, (error) => {
            console.log("Error getting document:", error);
          });
          commit("SET_UNSUBSCRIBE", unsubscribe);
        }

      } else {
        // No user is signed in.
        commit("ADD_USER", "");
        commit("UPDATE_BOOKS", []);
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
