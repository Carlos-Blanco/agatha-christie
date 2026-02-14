<template>
  <div class="collections-view">
    <router-link :to="{ name: 'Profile' }" class="btn--back">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      Atrás
    </router-link>
    
    <div class="header">
      <h2>Gestionar colección</h2>
      <p class="subtitle">Ordenado por fecha de publicación</p>
    </div>
    
    <div class="books-list">
      <div v-for="novel in sortedNovels" :key="novel.slug" class="book-item">
        <div class="book-cover">
          <img :src="novel.image" :alt="novel.title" loading="lazy" />
        </div>
        
        <div class="book-details">
          <h3 class="book-title">{{ novel.title }}</h3>
          
          <div class="actions">
            <!-- Collection Toggle: Feather Pen / Stamp Style -->
            <button 
              class="btn-action btn-collection" 
              :class="{ 'is-owned': isOwned(novel) }" 
              @click="toggleCollection(novel)"
              :title="isOwned(novel) ? 'En tu colección' : 'Añadir a colección'"
            >
              <span class="icon-feather">
                <!-- Feather Pen Icon -->
                <svg v-if="!isOwned(novel)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                  <line x1="16" y1="8" x2="2" y2="22"></line>
                  <line x1="17.5" y1="15" x2="9" y2="15"></line>
                </svg>
                <!-- Check/Stamp Icon for Owned -->
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </span>
              <span class="label">{{ isOwned(novel) ? 'En colección' : 'Añadir' }}</span>
            </button>

            <!-- Buy Button: Vintage Tag Style -->
            <a :href="novel.link" target="_blank" class="btn-action btn-buy" title="Comprar libro">
              <span class="icon-tag">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </span>
              <span class="label">Comprar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Collections",
  computed: {
    ...mapState(["books", "user"]),
    sortedNovels() {
      // Clone array to avoid mutating state directly during sort
      const novels = [...(this.$store.state.books.novels || [])];
      
      return novels.sort((a, b) => {
        const getYear = (novel) => {
           if (!novel.published) return 9999;
           if (typeof novel.published === 'number') return novel.published;
           if (typeof novel.published === 'string') {
               const match = novel.published.match(/\d{4}/);
               return match ? parseInt(match[0]) : 9999;
           }
           return 9999;
        };
        
        return getYear(a) - getYear(b);
      });
    }
  },
  mounted() {
    if (this.$store.state.books.novels.length === 0) {
      this.$store.dispatch('fetchNovels');
    }
  },
  methods: {
    isOwned(novel) {
      const ownedBooks = this.$store.state.user?.user?.ownedBooks || [];
      // Use loose comparison to handle ID vs Slug potential mismatches if needed, 
      // but strict is better if data is consistent. 
      // user.js uses .includes which is strict for identical types.
      // Let's assume slugs are strings.
      return ownedBooks.includes(novel.slug);
    },
    toggleCollection(novel) {
      const isAlreadyOwned = this.isOwned(novel);
      if (isAlreadyOwned) {
        this.$store.dispatch("removeFromCollection", novel.slug);
      } else {
        this.$store.dispatch("addToCollection", novel.slug);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.collections-view {
  min-height: 100vh;
  background: var(--color-bg-white); // Keep simple white/beige background
  padding: var(--spacing-xl) var(--spacing-md);
  
  .btn--back {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--color-sepia-dark);
    text-decoration: none;
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    transition: color 0.2s;
    
    &:hover {
      color: var(--color-sepia-primary);
    }
  }
  
  .header {
    margin-bottom: var(--spacing-xl);
    
    h2 {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--color-text-dark);
      margin: 0 0 4px 0;
      font-family: 'Playfair Display', serif; // Ensure serif font if available, or inherits
    }
    
    .subtitle {
      color: var(--color-text-light);
      font-size: 0.95rem;
      margin: 0;
    }
  }
  
  .books-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }
  
  .book-item {
    display: flex;
    gap: var(--spacing-md);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid rgba(139, 111, 71, 0.2); // Sepia tint border
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .book-cover {
    width: 70px; // Slightly smaller for list view
    height: 105px;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.15);
    }
  }
  
  .book-details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .book-title {
      margin: 0 0 12px 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-text-dark);
      line-height: 1.3;
      font-family: 'Playfair Display', serif;
    }
    
    .actions {
      display: flex;
      gap: 12px;
      
      .btn-action {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 20px; // Pill shape for elegance
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
        background: transparent;
        border: 1px solid #d1cdc7;
        color: var(--color-text-light);
        
        &:hover {
          border-color: var(--color-sepia-primary);
          color: var(--color-sepia-primary);
          background: rgba(139, 111, 71, 0.05);
        }
        
        .label {
            letter-spacing: 0.5px;
            text-transform: uppercase;
            font-size: 0.7rem;
        }
      }
      
      .btn-buy {
        // Tag style specific overrides if needed
      }
      
      .btn-collection {
        
        &.is-owned {
          background: var(--color-sepia-primary);
          color: white;
          border-color: var(--color-sepia-primary);
          
          &:hover {
            background: var(--color-sepia-dark);
            border-color: var(--color-sepia-dark);
          }
        }
      }
    }
  }
}
</style>
