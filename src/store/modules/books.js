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

    // We want to fetch the top 10 most rated books
    // If we have aggregated fields, we can query them directly.
    return db.collection("rating")
      .orderBy("ratingCount", "desc")
      .orderBy("lastRatedAt", "desc")
      .limit(10)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const trendingSlugs = snapshot.docs.map(doc => doc.id);

          // Now we need to match these slugs to the actual novel objects in state
          // Assuming fetchNovels has already run or will run. 
          // If state.novels is empty, we might need to wait or fetch them.
          // But for now, let's assume we filter from current state.

          if (state.novels.length > 0) {
            const trendingNovels = state.novels.filter(novel => trendingSlugs.includes(novel.slug));
            // Sort them to match the order returned by Firestore (most rated first)
            trendingNovels.sort((a, b) => {
              return trendingSlugs.indexOf(a.slug) - trendingSlugs.indexOf(b.slug);
            });
            commit("SET_TRENDING_NOVELS", trendingNovels);
          } else {
            // If novels aren't loaded yet, we can't map them. 
            // Maybe we should store the slugs and map them later?
            // Or better, just wait for fetchNovels. 
            // In Home.vue both are dispatched. user.js usually finishes first? No, both async.
            // We can chain them in Home.vue or just rely on reactivity if we were storing slugs.
            // But SET_TRENDING_NOVELS expects objects.
            // Let's try to fetch novels if empty, although Home.vue dispatches fetchNovels too.
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
            const trendingNovels = state.novels.filter((novel, index) => selectedNovelsIds.includes(index));
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

        // Update parent doc
        if (count > 0) {
          // We don't have accurate lastRatedAt, so we use serverTimestamp or null
          db.collection("rating").doc(slug).set({
            ratingCount: count,
            lastRatedAt: firebase.firestore.FieldValue.serverTimestamp() // Approximation
          }, { merge: true });
        }
      });
    });
  }
}
