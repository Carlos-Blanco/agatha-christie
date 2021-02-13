<template>
  <div v-if="novel">
  <router-link :to="{ name: 'Home' }" class="btn--back">Back</router-link>
    <div>
      <img :src="novel.image" :alt="novel.title" />
    </div>
    <div class="novel-details">
      <div class="flex-wrapper">
        <div></div>
        <a :href="novel.link" target="_blank" class="btn--buy">Buy Book</a>
      </div>
      <h3>{{ novel.title }}</h3>
      <input type="number" v-model.number="rate"/>
      <button @click="rateBook">
        Rate book
      </button>
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

export default {
  name: "BookDetail",
  props: ["id"],
  data() {
    return {
      novel: null,
      rate: null
    };
  },
  created() {
    BookService.getNovels()
      .then(response => {
        this.novel = response.data[this.id];
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    addBook() {
      this.$store.dispatch("updateBook", this.id);
    },
    rateBook() {
      firebase.database().ref('/db2/' + this.id).update({
          rate: this.rate
      });
    }
  },
  computed: {
    activeBook: function () {
      return this.$store.state.user.user.readBooks.includes(this.id);
    }
  }
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
    background: #f8a427;
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
  background: rgb(255,255,255);
  background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0.018644957983193322) 100%);
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
      background: url(/img/icons/icn-read-book-grey.svg) center no-repeat;
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
        background: url(/img/icons/icn-read-book-white.svg) center no-repeat;
        background-size: contain;
      }
    }
  }
}
.flex-wrapper {
  div, a {
    flex: 1;
  }
}
</style>
