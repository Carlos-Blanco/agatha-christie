import BookService from "@/services/BookService.js";
import firebase from "firebase/app";
import "firebase/firestore";

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
    const db = firebase.firestore();

    // Top 10 highest rated, ties broken by most recently rated (sort in JS to avoid composite index)
    return db.collection("rating")
      .orderBy("averageRating", "desc")
      .limit(20)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const sorted = snapshot.docs.sort((a, b) => {
            const ratingDiff = (b.data().averageRating || 0) - (a.data().averageRating || 0);
            if (ratingDiff !== 0) return ratingDiff;
            const aTime = a.data().lastRatedAt?.toMillis() || 0;
            const bTime = b.data().lastRatedAt?.toMillis() || 0;
            return bTime - aTime;
          });
          const trendingSlugs = sorted.slice(0, 10).map(doc => doc.id);

          if (state.novels.length > 0) {
            const trendingNovels = state.novels.filter(novel => trendingSlugs.includes(String(novel.slug)));
            trendingNovels.sort((a, b) => {
              return trendingSlugs.indexOf(String(a.slug)) - trendingSlugs.indexOf(String(b.slug));
            });
            commit("SET_TRENDING_NOVELS", trendingNovels);
          } else {
            // novels aún no cargadas: las pedimos para poder mapear los slugs
            BookService.getNovels().then(res => {
              const novels = res.data;
              const trendingNovels = novels.filter(novel => trendingSlugs.includes(novel.slug));
              trendingNovels.sort((a, b) => {
                return trendingSlugs.indexOf(a.slug) - trendingSlugs.indexOf(b.slug);
              });
              commit("SET_TRENDING_NOVELS", trendingNovels);
            });
          }
        } else {
          // Fallback to old logic or empty if no ratings yet
          console.log("No trending ratings found, using fallback.");
          // Fallback to old hardcoded list if no data
          if (state.novels.length > 0) {
            const selectedNovelsIds = [6, 11, 20, 24, 28, 33, 36, 38, 47, 48, 57];
            const trendingNovels = state.novels.filter((_, index) => selectedNovelsIds.includes(index));
            commit("SET_TRENDING_NOVELS", trendingNovels);
          }
        }
      })
      .catch(error => {
        console.error("Error fetching trending novels:", error);
      });
  },
  backfillRatings({ state }) {
    const db = firebase.firestore();
    // Iterate all novels from state (must be loaded)
    state.novels.forEach(novel => {
      const slug = novel.slug;
      if (!slug) return;

      db.collection("rating").doc(slug).collection("users").get().then(snap => {
        const count = snap.size;
        console.log(`Backfilling ${slug}: ${count} ratings`);

        if (count > 0) {
          let sum = 0;
          snap.forEach(doc => {
            if (doc.data().bookrate !== undefined) sum += doc.data().bookrate;
          });
          const averageRating = parseFloat((sum / count).toFixed(2));
          db.collection("rating").doc(slug).set({
            ratingCount: count,
            averageRating,
            lastRatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        }
      });
    });
  }
}
