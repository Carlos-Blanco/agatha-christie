import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import router from "@/router/index";

export const state = {
  user: {
    userinfo: "",
    userinfo: "",
    readBooks: [],
    ownedBooks: [],
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
  UPDATE_OWNED_BOOKS(state, value) {
    state.user.ownedBooks = value;
  },
  ADD_OWNED_BOOK(state, value) {
    state.user.ownedBooks.push(value);
  },
  REMOVE_OWNED_BOOK(state, index) {
    state.user.ownedBooks.splice(index, 1);
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

      // Try to find the book in the local state
      let index = state.user.readBooks.indexOf(value);

      // Fallback: If not found strictly, try loose comparison (e.g. string vs number)
      if (index === -1) {
        index = state.user.readBooks.findIndex(book => String(book) === String(value));
      }

      if (index > -1) {
        // It's in the list, so we are REMOVING it
        commit("REMOVE_BOOK", index);
        // We use the value passed, or should we use the one found? 
        // Firestore arrayRemove is strict. If we found via loose match, we might need to remove the ACTUAL item.
        // But for now, let's assume value is correct enough or Firestore handles it.
        // Actually, better to remove the item we found if we want to be sure?
        // But the value passed to updateBook usually comes from the UI which tries to match.
        // Let's stick to using 'value' for Firestore, but use 'index' for local splice.
        db.collection("users").doc(user.uid).update({ books: firebase.firestore.FieldValue.arrayRemove(value) })
      } else {
        // It's NOT in the list, so we are ADDING it
        commit("ADD_BOOK", value); // Optimistic add
        db.collection("users").doc(user.uid).update({ books: firebase.firestore.FieldValue.arrayUnion(value) })
      }
    } else {
      // No user is signed in.
      router.push({ name: "SignUp" })
    }
  },
  addToCollection({ state, commit }, value) {
    const user = firebase.auth().currentUser;
    if (user) {
      const db = firebase.firestore();
      // Check if already in ownedBooks
      if (!state.user.ownedBooks.includes(value)) {
        commit("ADD_OWNED_BOOK", value); // Optimistic update
        db.collection("users").doc(user.uid).update({
          ownedBooks: firebase.firestore.FieldValue.arrayUnion(value)
        }, { merge: true }).catch(err => {
          // Create doc if it doesn't exist (though it should from signup)
          if (err.code === 'not-found') {
            db.collection("users").doc(user.uid).set({
              ownedBooks: [value],
              books: state.user.readBooks
            }, { merge: true });
          }
        });
      }
    } else {
      router.push({ name: "SignUp" });
    }
  },
  removeFromCollection({ state, commit }, value) {
    const user = firebase.auth().currentUser;
    if (user) {
      const db = firebase.firestore();
      const index = state.user.ownedBooks.indexOf(value);
      if (index > -1) {
        commit("REMOVE_OWNED_BOOK", index); // Optimistic update
        db.collection("users").doc(user.uid).update({
          ownedBooks: firebase.firestore.FieldValue.arrayRemove(value)
        });
      }
    }
  },
  saveRating({ state }, { slug, rating }) {
    const user = firebase.auth().currentUser;
    if (user) {
      const db = firebase.firestore();

      const ratingRef = db.collection("rating").doc(slug);
      const userRatingRef = ratingRef.collection("users").doc(user.uid);

      // We should check if the user already rated to avoid double counting if we were just incrementing blind
      // But for now, let's assume we are just setting it. 
      // Ideally we would run a transaction:
      // 1. Check if userRatingRef exists.
      // 2. If not, increment ratingCount.
      // 3. Set userRatingRef.
      // 4. Update parent lastRatedAt.

      return db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRatingRef);

        if (!userDoc.exists) {
          // New rating, increment count
          transaction.update(ratingRef, {
            ratingCount: firebase.firestore.FieldValue.increment(1),
            lastRatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        } else {
          // Just updating timestamp if re-rating
          transaction.update(ratingRef, {
            lastRatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }

        transaction.set(userRatingRef, {
          bookrate: rating,
          ratedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
    }
  },
  removeRating({ state }, slug) {
    const user = firebase.auth().currentUser;
    if (user) {
      const db = firebase.firestore();

      const ratingRef = db.collection("rating").doc(slug);
      const userRatingRef = ratingRef.collection("users").doc(user.uid);

      return db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRatingRef);

        if (userDoc.exists) {
          transaction.delete(userRatingRef);
          transaction.update(ratingRef, {
            ratingCount: firebase.firestore.FieldValue.increment(-1)
          });
        }
      });
    }
  },
  signup({ commit }, value) {
    commit("CLEAR_AUTH_ERROR");
    firebase
      .auth()
      .createUserWithEmailAndPassword(value.email, value.password)
      .then(user => {
        const db = firebase.firestore()
        db.collection("users").doc(user.user.uid).set({ books: [], ownedBooks: [] });
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
              var data = doc.data();
              commit("UPDATE_BOOKS", data.books || []);
              commit("UPDATE_OWNED_BOOKS", data.ownedBooks || []);
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
