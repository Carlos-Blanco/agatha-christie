<template>
  <div v-if="novel">
    <router-link :to="{ name: 'Home' }" class="btn--back">Atrás</router-link>
    <div>
      <img :src="novel.image" :alt="novel.title" />
    </div>
    <div class="novel-details">
      <div class="flex-wrapper">
        <div>
          <star-rating v-model:rating="rating" v-bind:increment="0.5" v-bind:max-rating="5" v-bind:show-rating="false"
            v-bind:star-size="25" active-color="#f8a427" @click="rateBook"></star-rating>
        </div>
        <a :href="novel.link" target="_blank" class="btn--buy">Comprar libro</a>
      </div>
      <h3>{{ novel.title }}</h3>
      <p>{{ novel.description }}</p>
      <div class="novel-details__button-wrapper">
        <button @click="addBook" :class="{ active: activeBook }">
          {{ activeBook ? "Leido" : "Marcar como leido" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import BookService from "@/services/BookService.js";
import firebase from "firebase";
import StarRating from "vue-star-rating";

export default {
  name: "BookDetail",
  props: ["slug"],
  data() {
    return {
      novel: null,
      rating: null,
    };
  },
  async created() {
    try {
      const novel = await BookService.getNovelBySlug(this.slug);

      if (novel) {
        this.novel = novel;

        // Validate novel slug and user UID before Firebase call
        const novelSlug = this.novel.slug;
        const userUID = this.$store.state.user.user.userinfo;

        if (typeof novelSlug !== 'string' || novelSlug.trim() === '' ||
            typeof userUID !== 'string' || userUID.trim() === '') {
          console.error(`Invalid novel slug or user UID for Firebase path. Slug: "${novelSlug}", UserInfo: "${userUID}"`);
          this.$router.push({ name: '404' });
          return; // Stop further execution in this block
        }

        // Now that novel is found and IDs are validated, fetch its rating
        const db = firebase.firestore();
        // Use validated novelSlug and userUID
        var docRef = db.collection("rating").doc(novelSlug).collection("users").doc(userUID);
        
        docRef.get().then((doc) => {
          if (doc.exists) {
            var bookrate = doc.data();
            this.rating = bookrate.bookrate;
          } else {
            // Handle case where rating doesn't exist for this user/book
            this.rating = null; 
          }
        }).catch(ratingError => {
          console.error("Error fetching rating:", ratingError);
          this.rating = null; // Set rating to null or default on error
        });

      } else {
        // Novel not found by slug, or an error occurred in getNovelBySlug
        this.$router.push({ name: '404' });
      }
    } catch (error) {
      // This catch block handles errors from getNovelBySlug if it re-throws,
      // or any other unexpected errors in the try block.
      // Since getNovelBySlug is set to return null on error, this might not be strictly necessary
      // unless getNovelBySlug is changed to re-throw.
      console.error("Error in created hook:", error);
      this.$router.push({ name: '404' });
    }
  },
  methods: {
    addBook() {
      this.$store.dispatch("updateBook", this.slug);
    },
    rateBook() {
      const db = firebase.firestore();
      db.collection("rating")
        .doc(this.slug)
        .collection("users")
        .doc(this.$store.state.user.user.userinfo)
        .set({ bookrate: this.rating });
    },
  },
  computed: {
    activeBook: function () {
      return this.$store.state.user.user.readBooks.includes(this.slug);
    }
  },
  components: {
    StarRating,
  },
};
</script>

<style lang="scss" scoped>
.btn--back {
  margin: 1rem;
}

img {
  display: block;
  margin: 0 auto;
  max-width: 150px;
  width: 100%;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 15px -6px rgba(0, 0, 0, 0.7);
}

.novel-details {
  background: var(--color-background);
  border-radius: 30px 30px 0 0;
  padding: 1rem 1rem 3rem;
  margin-top: 2rem;
  min-height: calc(100vh - 330px);

  h3 {
    font-size: 2rem;
    font-weight: 900;
  }

  a.btn--buy {
    background: #ff5e58;
    font-weight: bold;
    color: white;
    padding: 0.5rem 0;
    border-radius: var(--border-radius);
    font-size: 1rem;
    text-align: center;

    &:hover {
      background: #ec9616;
    }
  }
}

.novel-details__button-wrapper {
  background: rgb(255, 255, 255);
  background: linear-gradient(0deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 1) 80%,
      rgba(255, 255, 255, 0.018644957983193322) 100%);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem 1rem 0.5rem;

  button {
    background: #cecece;
    color: #5f5f5f;
    cursor: pointer;
    font-weight: bold;
    padding: 0.7rem 2rem;
    border-radius: var(--border-radius);
    border: none;
    outline: none;
    font-size: 1rem;
    width: 100%;

    &:before {
      content: "";
      background: url(../assets/icons/icn-read-book-grey.svg) center no-repeat;
      background-size: contain;
      height: 0.8rem;
      width: 0.8rem;
      margin-right: 1ch;
      position: relative;
      top: 1px;
      display: inline-block;
    }

    &.active {
      color: white;
      background: cadetblue;

      &:before {
        background: url(../assets/icons/icn-read-book-white.svg) center no-repeat;
        background-size: contain;
      }
    }
  }
}

.flex-wrapper {

  div,
  a {
    flex: 1;
  }

  div {
    padding-top: 0.2rem;
  }
}

.vue-star-rating-rating-text {
  color: white;
  background: cadetblue;
  height: 35px;
  width: 35px;
  position: relative;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 3px;
}
</style>
