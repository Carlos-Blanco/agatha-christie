<template>
  <div v-if="novel" class="book-detail">
    <!-- Header Navigation -->
    <div class="header-nav">
      <router-link :to="{ name: 'Home' }" class="btn--back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Atrás
      </router-link>
    </div>
    
    <!-- Book Cover Hero -->
    <div class="cover-hero">
      <img :src="novel.image" :alt="novel.title" />
    </div>
    
    <!-- Book Info Card -->
    <div class="info-card">
      <!-- Rating -->
      <div class="rating-wrapper">
        <star-rating 
          v-model:rating="rating" 
          v-bind:increment="0.5" 
          v-bind:max-rating="5" 
          v-bind:show-rating="false"
          v-bind:star-size="20" 
          active-color="#f8a427" 
          @click="rateBook">
        </star-rating>
        <span class="rating-count">{{ rating || 0 }}</span>
      </div>
      
      <!-- Title & Author -->
      <h1 class="book-title">{{ novel.title }}</h1>
      <p class="book-author">Agatha Christie</p>
      
      <!-- Buy Button with Price -->
      <a :href="novel.link" target="_blank" class="btn-buy">
        Comprar Libro — €14.99
      </a>
      
      <!-- Metadata Cards -->
      <div class="metadata-grid">
        <div class="meta-card">
          <div class="meta-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div class="meta-label">Publicado</div>
          <div class="meta-value">1934</div>
        </div>
        <div class="meta-card">
          <div class="meta-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div class="meta-label">Páginas</div>
          <div class="meta-value">256 Páginas</div>
        </div>
      </div>
      
      <!-- Reading Progress -->
      <div class="progress-section" v-if="activeBook">
        <h3>Progreso de Lectura</h3>
        <div class="progress-container">
          <ve-progress
            :progress="75"
            color="#B8956A"
            :size="80"
            :thickness="8"
            empty-thickness="10%"
            legendClass="legend-custom-style">
          </ve-progress>
        </div>
      </div>
      
      <!-- Synopsis -->
      <div class="synopsis">
        <h3>Sinopsis</h3>
        <p>{{ novel.description }}</p>
      </div>
      
      <!-- Tags -->
      <div class="tags">
        <span class="tag">Mystery</span>
        <span class="tag">Crime Fiction</span>
      </div>
      
      <!-- Mark as Read Button -->
      <div class="action-button">
        <button @click="addBook" :class="{ active: activeBook }">
          <span v-if="!activeBook">✓</span>
          {{ activeBook ? "Leído" : "Marcar como leído" }}
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
        
        // Setup a watcher or check for user to fetch rating
        // Fetch immediately if user exists
        if (this.$store.state.user.user.userinfo) {
           this.fetchRating();
        }
      } else {
        this.$router.push({ name: '404' });
      }
    } catch (error) {
       this.$router.push({ name: '404' });
    }
  },
  watch: {
    '$store.state.user.user.userinfo': function(newVal) {
        if (newVal && this.novel) {
            this.fetchRating();
        }
    }
  },
  methods: {
    fetchRating() {
         const novelSlug = this.novel.slug;
         const userUID = this.$store.state.user.user.userinfo;
         
         if (!userUID || !novelSlug) return;

         const db = firebase.firestore();
         var docRef = db.collection("rating").doc(novelSlug).collection("users").doc(userUID);
        
         docRef.get().then((doc) => {
          if (doc.exists) {
            var bookrate = doc.data();
            this.rating = bookrate.bookrate;
          } else {
            this.rating = null; 
          }
        }).catch(ratingError => {
          console.error("Error fetching rating:", ratingError);
          this.rating = null;
        });
    },
    addBook() {
      const readBooks = this.$store.state.user?.user?.readBooks || [];
      const identifierInList = readBooks.find(item => 
        String(item) === String(this.novel.slug) || 
        String(item) === String(this.novel.id)
      );
      
      // Use the identifier found in the list if it exists, otherwise use slug
      this.$store.dispatch("updateBook", identifierInList || this.slug);
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
    activeBook() {
      const readBooks = this.$store.state.user?.user?.readBooks || [];
      if (!this.novel) return false;
      
      // Check if either the slug or the ID is in the readBooks list
      return readBooks.some(item => 
        String(item) === String(this.novel.slug) || 
        String(item) === String(this.novel.id)
      );
    }
  },
  components: {
    StarRating,
  },
};
</script>

<style lang="scss" scoped>

img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
}
.book-detail {
  min-height: 100vh;
  background: var(--color-bg-white);
  padding-bottom: 5rem;
  position: relative;
  
  // Header Navigation
  .header-nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-xl) var(--spacing-lg);
    z-index: 10;
  }
  
  .btn--back {
    color: var(--color-sepia-dark);
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    transition: color 0.2s ease;
    font-family: var(--font-main);
    display: flex;
    align-items: center;
    gap: 4px;
    
    svg {
      transition: transform 0.2s ease;
    }
    
    &:hover {
      color: var(--color-sepia-primary);
      
      svg {
        transform: translateX(-2px);
      }
    }
  }
  
  // Cover Hero Section
  .cover-hero {
    padding: var(--spacing-2xl) var(--spacing-xl) var(--spacing-xl);
    display: flex;
    justify-content: center;
    
    img {
      width: 200px;
      height: 300px;
      object-fit: cover;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-book);
    }
  }
  
  // Info Card with deeper beige background
  .info-card {
    background: var(--color-bg-deep-beige); // #EDE6D6 - V2 darker beige
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
    padding: var(--spacing-xl);
    
    // Rating
    .rating-wrapper {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
      
      .rating-count {
        color: var(--color-text-light);
        font-weight: 600;
        font-size: 0.9rem;
      }
    }
    
    // Title & Author
    .book-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text-dark);
      margin: 0 0 var(--spacing-xs) 0;
      line-height: 1.3;
    }
    
    .book-author {
      color: var(--color-text-light);
      font-size: 1rem;
      margin: 0 0 var(--spacing-lg) 0;
    }
    
    // Buy Button with Price
    .btn-buy {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      width: 100%;
      height: 3.5rem;
      background: var(--color-sepia-primary);
      color: white;
      text-decoration: none;
      border-radius: var(--border-radius);
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.2s ease;
      margin-bottom: var(--spacing-lg);
      font-family: var(--font-main);
      
      &:hover {
        background: var(--color-sepia-dark);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }
    }
    
    // Metadata Grid
    .metadata-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
      
      .meta-card {
        background: rgba(255, 255, 255, 0.6);
        border-radius: var(--border-radius-sm);
        padding: var(--spacing-md);
        text-align: center;
        
        .meta-icon {
          display: flex;
          justify-content: center;
          margin-bottom: var(--spacing-sm);
          
          svg {
            color: var(--color-sepia-primary);
            opacity: 0.8;
          }
        }
        
        .meta-label {
          font-size: 0.75rem;
          color: var(--color-text-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: var(--spacing-xs);
        }
        
        .meta-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-dark);
        }
      }
    }
    
    // Reading Progress Section
    .progress-section {
      margin-bottom: var(--spacing-xl);
      padding: var(--spacing-lg);
      background: rgba(255, 255, 255, 0.4);
      border-radius: var(--border-radius);
      
      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-text-dark);
        margin: 0 0 var(--spacing-md) 0;
      }
      
      .progress-container {
        display: flex;
        justify-content: center;
      }
    }
    
    // Synopsis
    .synopsis {
      margin-bottom: var(--spacing-lg);
      
      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--color-text-dark);
        margin: 0 0 var(--spacing-md) 0;
      }
      
      p {
        color: var(--color-text-brown);
        font-size: 0.95rem;
        line-height: 1.6;
        margin: 0;
      }
    }
    
    // Tags
    .tags {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-xl);
      
      .tag {
        background: rgba(184, 149, 106, 0.15);
        color: var(--color-sepia-dark);
        padding: var(--spacing-xs) var(--spacing-md);
        border-radius: var(--border-radius-full);
        font-size: 0.85rem;
        font-weight: 500;
      }
    }
    
    // Action Button
    .action-button {
      button {
        width: 100%;
        height: 3.5rem;
        background: var(--color-sepia-primary);
        border: none;
        color: white;
        border-radius: var(--border-radius);
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: var(--font-main);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
        
        span {
          font-size: 1.2rem;
        }
        
        &:hover {
          background: var(--color-sepia-dark);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        
        &.active {
          background: var(--color-bg-warm-beige);
          color: var(--color-sepia-primary);
          border: 2px solid var(--color-sepia-primary);
          
          &:hover {
            background: var(--color-bg-warm-beige);
            transform: translateY(0);
          }
        }
      }
    }
  }
}

// Custom styling for progress circle
::v-deep .legend-custom-style {
  color: var(--color-sepia-primary) !important;
  font-weight: 700 !important;
  font-size: 1.2rem !important;
}
</style>
