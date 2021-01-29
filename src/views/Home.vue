<template>
  <div class="books-list">
    <div class="input-wrapper">
      <div></div>
      <input type="text" placeholder="Search" v-model="search"/>
    </div>
    <h2>Trending books</h2>
    <div class="trending-books">
      <TrendingBooks v-for="novel in trendingnovels" :key="novel.id" :novel="novel" />
    </div>
    <h2>Agatha Christie books</h2>
    <BookList v-for="novel in novels" :key="novel.id" :novel="novel" />
  </div>
</template>

<script>
import BookList from '@/components/BookList.vue'
import TrendingBooks from '@/components/TrendingBooks.vue'
import EventService from '@/services/EventService.js'

export default {
  name: 'App',
  components: {
    BookList,
    TrendingBooks
  },
  data() {
    return {
      novels: [],
      selectednovels: [5,21,26,9,49,14,28,38],
      trendingnovels: [],
      search: ''
    }
  },
  created() {
    EventService.getNovels()
      .then(response => {
        this.novels = response.data
        for(var i = 0; i < this.selectednovels.length; i++)
        this.trendingnovels.push(this.novels[this.selectednovels[i]]);
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<style lang="scss" scoped>
.books-list {
  margin: 1rem;
  .input-wrapper {
    display: flex;
    background: #F7F7F7;
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
        top: 13px;
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
