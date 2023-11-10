<template>
  <div v-if="novel">
    <router-link :to="{ name: 'Home' }" class="btn--back">Atrás</router-link>
    <div>
      <img :src="novel.image" :alt="novel.title" />
    </div>
    <div class="novel-details">
      <div class="flex-wrapper">
        <div>
          <star-rating
            v-model:rating="rating"
            v-bind:increment="0.5"
            v-bind:max-rating="5"
            v-bind:show-rating="false"
            v-bind:star-size="25"
            active-color="#f8a427"
            @click="rateBook"
          ></star-rating>
        </div>
      </div>
      <h3>{{ novel.title }}</h3>
      <p>{{ novel.description }}</p>
      <div class="novel-details__button-wrapper">
        <button @click="addBook" :class="{ active: activeBook }">
          {{ activeBook ? "Unread" : "Mark as Read" }}
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
  props: ["id"],
  data() {
    return {
      novel: null,
      rating: null,
    };
  },
  created() {
    BookService.getNovels()
      .then((response) => {
        this.novel = response.data[this.id];
      })
      .catch((error) => {
        console.log(error);
      });

    const db = firebase.firestore();
    var docRef = db.collection("rating").doc(this.id).collection("users").doc(this.$store.state.user.user.userinfo);
    docRef.get().then((doc) => {
        if (doc.exists) {
            var bookrate = doc.data()
            this.rating = bookrate.bookrate;
        }
    });

  },
  methods: {
    addBook() {
      this.$store.dispatch("updateBook", this.id);
    },
    rateBook() {
      const db = firebase.firestore();
      db.collection("rating")
        .doc(this.id)
        .collection("users")
        .doc(this.$store.state.user.user.userinfo)
        .set({ bookrate: this.rating });
    },
  },
  computed: {
    activeBook: function () {
      return this.$store.state.user.user.readBooks.includes(this.id);
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
}
.novel-details__button-wrapper {
  background: rgb(255, 255, 255);
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 80%,
    rgba(255, 255, 255, 0.018644957983193322) 100%
  );
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
