<template>
  <div class="books-list">
    <header>
      <div>
        <h1>Agatha Christie Books</h1>
      </div>
      <router-link :to="{ name: 'Profile' }">
        <img src="/img/icons/user-profile.svg" />
      </router-link>
    </header>
    <div class="input-wrapper">
      <div></div>
      <input type="text" placeholder="Search" v-model="searchTerm" />
    </div>
    <div v-if="!searchTerm">
      <h2>Trending books</h2>
      <div class="trending-books">
        <TrendingBooks
          v-for="novel in books.trendingNovels"
          :key="novel.id"
          :novel="novel"
        />
      </div>
    </div>
    <h2>Agatha Christie books</h2>
    <BookList v-for="novel in filterByTerm" :key="novel.id" :novel="novel" />
  </div>
</template>

<script>
import BookList from "@/components/BookList.vue";
import TrendingBooks from "@/components/TrendingBooks.vue";
import { mapState } from "vuex";

export default {
  name: "App",
  components: {
    BookList,
    TrendingBooks
  },
  data() {
    return {
      searchTerm: ""
    };
  },
  created() {
    this.$store.dispatch("fetchNovels");
    this.$store.dispatch("fetchTrendingNovels");
    this.$store.dispatch("checkAuth");
  },
  computed: {
    filterByTerm() {
      return this.books.novels.filter(novel => {
        return novel.title.toLowerCase().match(this.searchTerm.toLowerCase());
      });
    },
    ...mapState(["books"])
  }
};
</script>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  h1 {
    font-size: 1.4rem;
    margin: 0.1rem;
  }
}
.books-list {
  margin: 1rem;
  .input-wrapper {
    display: flex;
    background: #f7f7f7;
    border-radius: var(--border-radius);
    div {
      width: 3rem;
      &:before {
        content: "";
        width: 1.5rem;
        height: 1.5rem;
        background: url(/img/icons/icn-magnifying-glass.svg);
        display: inline-block;
        background-size: contain;
        position: relative;
        top: 12px;
        left: 10px;
      }
    }
    input {
      height: 3rem;
      border: none;
      background: none;
      font-size: 1.2rem;
      color: var(--color-text);
      width: 100%;
      &:focus {
        outline: none;
      }
    }
  }
}
.trending-books {
  display: flex;
  overflow-x: scroll;
  scroll-padding: 0 50%;
  scroll-snap-type: x mandatory;
  padding-bottom: 1.5rem;
}
</style>
