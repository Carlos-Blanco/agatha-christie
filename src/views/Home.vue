<template>
  <div class="books-list">
    <header>
      <div>
        <h1>Agatha Christie</h1>
      </div>
      <router-link :to="{ name: 'Profile' }" class="profile-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </router-link>
    </header>
    <div class="input-wrapper">
      <div class="search-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>
      <input type="text" placeholder="Buscar" v-model="searchTerm" />
    </div>
    <div v-if="!searchTerm">
      <h2>Los más leídos</h2>
      <div class="trending-books">
        <TrendingBooks
          v-for="novel in books.trendingNovels"
          :key="novel.id"
          :novel="novel"
        />
      </div>
    </div>
    <h2>Novelas de Agatha Christie</h2>
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
.books-list {
  padding-bottom: 3rem;
  padding-left: var(--spacing-lg);
  padding-right: var(--spacing-lg);
  background: var(--color-bg-white);
  min-height: 100vh;
  
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-xl);
    padding-top: var(--spacing-md);
    
    h1 {
      color: var(--color-text-dark);
      font-weight: 700;
      font-size: 1.8rem;
    }
    
    .profile-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--border-radius-full);
      background: var(--color-bg-warm-beige);
      transition: all 0.2s ease;
      
      svg {
        color: var(--color-sepia-dark);
      }
      
      &:hover {
        background: var(--color-sepia-primary);
        transform: scale(1.05);
        
        svg {
          color: white;
        }
      }
    }
  }
  
  h2 {
    margin-bottom: var(--spacing-md);
    color: var(--color-text-dark);
    font-weight: 700;
    font-size: 1.3rem;
  }
  
  .trending-books {
    display: flex;
    margin-bottom: var(--spacing-2xl);
    overflow-x: scroll;
    scroll-snap-type: x proximity;
    padding-bottom: var(--spacing-sm);
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  .input-wrapper {
    position: relative;
    margin-bottom: var(--spacing-xl);
    
    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      
      svg {
        color: var(--color-text-light);
        opacity: 0.6;
      }
    }
    
    input {
      background: var(--color-bg-warm-beige);
      border-radius: var(--border-radius);
      border: 1px solid transparent;
      height: 3.5rem;
      padding-left: 3.5rem;
      font-size: 1.1rem;
      width: 100%;
      color: var(--color-text-dark);
      transition: all 0.2s ease;
      font-family: var(--font-main);
      
      &::placeholder {
        color: var(--color-text-light);
      }
      
      &:focus {
        outline: none;
        background: var(--color-bg-white);
        border-color: var(--color-sepia-primary);
        box-shadow: var(--shadow-sm);
      }
    }
  }
}
</style>
