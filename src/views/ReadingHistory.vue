<template>
  <div class="reading-history">
    <router-link :to="{ name: 'Profile'}" class="btn--back">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      Atrás
    </router-link>
    
    <!-- Header -->
    <div class="history-header">
      <h1>Mi Historial de Lectura</h1>
      <p class="book-count">{{ readBooksCount }} {{ readBooksCount === 1 ? 'libro leído' : 'libros leídos' }}</p>
    </div>
    
    <!-- Books List -->
    <div v-if="readBooksList.length > 0" class="books-container">
      <BookList 
        v-for="novel in readBooksList" 
        :key="novel.id" 
        :novel="novel"
      />
    </div>
    
    <!-- Empty State -->
    <div v-else class="empty-state">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
      <h3>Aún no has leído ningún libro</h3>
      <p>Comienza a explorar nuestra colección</p>
      <router-link :to="{ name: 'Home' }" class="btn-explore">
        Explorar Libros
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BookList from '@/components/BookList.vue';

export default {
  name: 'ReadingHistory',
  components: {
    BookList
  },
  computed: {
    readBooksCount() {
      // Direct store access to avoid any mapping issues
      return this.$store.state.user?.user?.readBooks?.length || 0;
    },
    readBooksList() {
      const readBooksSlugs = this.$store.state.user?.user?.readBooks || [];
      const allNovels = this.$store.state.books?.novels || [];
      
      if (!allNovels || allNovels.length === 0) return [];
      
      // Filter novels using a flexible comparison
      return allNovels.filter(novel => {
        return readBooksSlugs.some(slugOrId => 
          String(slugOrId) === String(novel.slug) || String(slugOrId) === String(novel.id)
        );
      });
    }
  },
  created() {
    // Always ensure books are fetching/loaded as in Home.vue
    this.$store.dispatch('fetchNovels');
  },
  async mounted() {
    // Optional: reload if specifically needed, but created should trigger it
  }
};
</script>

<style lang="scss" scoped>
.reading-history {
  min-height: 100vh;
  padding: var(--spacing-xl) var(--spacing-lg) var(--spacing-2xl);
  background: var(--color-bg-white);
  position: relative;
}

.btn--back {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-sepia-primary);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  
  svg {
    transition: transform 0.2s ease;
  }
  
  &:hover {
    background: var(--color-bg-warm-beige);
    
    svg {
      transform: translateX(-3px);
    }
  }
}

.history-header {
  margin-bottom: var(--spacing-xl);
  
  h1 {
    color: var(--color-text-dark);
    font-weight: 700;
    font-size: 1.8rem;
    margin-bottom: var(--spacing-sm);
  }
  
  .book-count {
    color: var(--color-text-light);
    font-size: 1rem;
    margin: 0;
  }
}

.books-container {
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  margin-top: var(--spacing-2xl);
  
  svg {
    color: var(--color-text-light);
    margin-bottom: var(--spacing-lg);
    opacity: 0.5;
  }
  
  h3 {
    color: var(--color-text-dark);
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    color: var(--color-text-light);
    margin-bottom: var(--spacing-xl);
  }
  
  .btn-explore {
    background: var(--color-sepia-primary);
    color: white;
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-block;
    
    &:hover {
      background: var(--color-sepia-dark);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }
  }
}
</style>
