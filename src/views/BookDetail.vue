<template>
  <div v-if="novel" class="book-detail">
    <!-- Header Navigation -->
    <div class="header-nav">
      <router-link :to="{ name: 'Home' }" class="btn--back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        {{ $t('nav.back') }}
      </router-link>
      <div class="header-actions">
        <a :href="novel.link" target="_blank" class="btn-action-icon" :title="$t('collections.buy')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
            <path d="M3 6h18"></path>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </a>
        <button class="btn-action-icon" :class="{ 'is-active': activeBook }" :key="'btn-' + activeBook" @click="addBook" :title="$t('book_detail.mark_as_read')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Finishing Modal -->
    <FinishingModal 
      :show="showRatingModal" 
      @close="showRatingModal = false" 
      @save="handleRatingSave">
    </FinishingModal>
    
    <!-- Book Cover Hero -->
    <div class="cover-hero">
      <img :src="novel.image" :alt="displayTitle" />
    </div>
    
    <!-- Book Info Card -->
    <div class="info-card">
      <!-- Rating & Protagonist Row -->
      <div class="rating-row">
        <div class="rating-wrapper">
          <star-rating 
            v-model:rating="rating" 
            v-bind:increment="0.1" 
            v-bind:max-rating="5" 
            v-bind:show-rating="false"
            v-bind:star-size="18" 
            v-bind:read-only="true"
            active-color="#f8a427">
          </star-rating>
          <span class="rating-count">{{ rating || 0.0 }} <span v-if="totalRatings > 0" class="total-ratings">({{ totalRatings }})</span></span>
        </div>
        
        <div v-if="novel.protagonist" class="protagonist-badge" :class="protagonistClass">
          <span class="badge-icon" v-html="protagonistIcon"></span>
          <span class="badge-name">{{ novel.protagonist }}</span>
        </div>
      </div>
      
      <!-- Title & Author -->
      <h1 class="book-title">{{ displayTitle }}</h1>
      <p class="book-author">{{ $t('common.author') }}</p>
      
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
          <div class="meta-label">{{ $t('book_detail.published') }}</div>
          <div class="meta-value">{{ novel.published }}</div>
        </div>
      </div>
      
      <!-- Synopsis -->
      <div class="synopsis">
        <h3>{{ $t('book_detail.synopsis') }}</h3>
        <p>{{ displayDescription }}</p>
      </div>
      
      <!-- Tags -->
      <div class="tags">
        <span class="tag">{{ $t('tags.mystery') }}</span>
        <span class="tag">{{ $t('tags.crime_fiction') }}</span>
      </div>
      

    </div>
  </div>
</template>

<script>
import BookService from "@/services/BookService.js";
import firebase from "firebase";
import StarRating from "vue-star-rating";
import RatingModal from "../components/RatingModal.vue";

export default {
  name: "BookDetail",
  props: ["slug"],
  components: {
    StarRating,
    FinishingModal: RatingModal
  },
  data() {
    return {
      novel: null,
      rating: 0,
      totalRatings: 0,
      showRatingModal: false
    };
  },
  async created() {
    try {
      const novel = await BookService.getNovelBySlug(this.slug);

      if (novel) {
        this.novel = novel;
        this.fetchRating();
      } else {
        this.$router.push({ name: '404' });
      }
    } catch (error) {
       this.$router.push({ name: '404' });
    }
  },
  // No longer needed: we fetch average rating for everyone, not per user
  methods: {
    async fetchRating() {
         const novelSlug = this.novel?.slug;
         if (!novelSlug) return;

         const db = firebase.firestore();
         try {
           const querySnapshot = await db.collection("rating").doc(novelSlug).collection("users").get();
           if (!querySnapshot.empty) {
             let sum = 0;
             let count = 0;
             querySnapshot.forEach((doc) => {
               const data = doc.data();
               if (data.bookrate !== undefined) {
                 sum += data.bookrate;
                 count++;
               }
             });
             this.rating = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
             this.totalRatings = count;
           } else {
             this.rating = 0;
             this.totalRatings = 0;
           }
         } catch (error) {
           console.error("Error fetching ratings:", error);
         }
    },
    addBook() {
      const readBooks = this.$store.state.user?.user?.readBooks || [];
      const isAlreadyRead = readBooks.find(item => 
        String(item) === String(this.novel.slug) || 
        String(item) === String(this.novel.id)
      );
      
      if (!isAlreadyRead) {
        // Opening the modal to get a rating before marking as read
        this.showRatingModal = true;
      } else {
        // If already read, we just toggle it off (standard behavior)
        // Ensure we pass the EXACT value that is in the array to ensure strict equality works in the store
        // If isAlreadyRead is undefined (shouldn't be here), fallback to slug/id logic but carefully
        let identifierToRemove = isAlreadyRead; 
        
        if (identifierToRemove === undefined) {
           // Fallback if logic failed to find it despite entering else block
           identifierToRemove = this.slug;
        }

        this.$store.dispatch("updateBook", identifierToRemove);
        
        // Also remove the rating
        this.$store.dispatch("removeRating", this.novel.slug)
          .then(() => {
            this.rating = 0; // Reset local rating if needed
            this.fetchRating(); // Refresh average
          })
          .catch(error => {
            console.error("Error removing rating:", error);
          });
      }
    },
    async handleRatingSave(rating) {
      this.showRatingModal = false;
      
      // Save the rating to Firestore
      await this.$store.dispatch("saveRating", { 
        slug: this.novel.slug, 
        rating 
      });
      
      // Mark as read
      this.$store.dispatch("updateBook", this.slug);
      
      // Refresh the average ratings display
      this.fetchRating();
    },
    // No longer editable from this view
    rateBook() {
      // Disabled
    },
  },
  computed: {
    activeBook() {
      const readBooks = this.$store.state.user?.user?.readBooks || [];
      if (!this.novel) return false;
      
      // Check if either the slug or the ID is in the readBooks list
      const isActive = readBooks.some(item => 
        String(item) === String(this.novel.slug) || 
        String(item) === String(this.novel.id)
      );
      return isActive;
    },
    protagonistClass() {
      if (!this.novel?.protagonist) return '';
      return this.novel.protagonist.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
    },
    protagonistIcon() {
      const p = this.novel?.protagonist;
      if (!p) return '';
      
      if (p.includes('Poirot')) {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 12c.5-2.5 3-4.5 7.5-4 0 0 .5-3 6.5-1 4.5 2 4.5 5.5 4.5 5.5s-4-.5-8.5-2c0 0-1 4.5-10 1.5z"/></svg>`;
      } else if (p.includes('Marple')) {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4"/></svg>`;
      } else if (p === 'Standalone') {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
      } else {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
      }
    },
    displayTitle() {
      if (!this.novel) return '';
      return this.$i18n.locale === 'en' && this.novel.title_en ? this.novel.title_en : this.novel.title;
    },
    displayDescription() {
      if (!this.novel) return '';
      return this.$i18n.locale === 'en' && this.novel.description_en ? this.novel.description_en : this.novel.description;
    }
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
      transition: all 0.2s ease;
      font-family: var(--font-main);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-sm);
      
      svg {
        transition: transform 0.2s ease;
      }
      
      &:hover {
        color: var(--color-sepia-primary);
        background: rgba(184, 149, 106, 0.1);
        
        svg {
          transform: translateX(-2px);
        }
      }
    }

    .header-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .btn-action-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      color: var(--color-sepia-primary);
      border: 1px solid var(--color-sepia-primary);
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm);
      padding: 0;
      
      &:hover {
        background: var(--color-sepia-primary);
        color: white;
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }

      &.is-active {
        background: var(--color-sepia-primary);
        color: white;
        border-color: var(--color-sepia-primary);
      }
    }
  
  // Cover Hero Section
  .cover-hero {
    padding: 6rem var(--spacing-xl) var(--spacing-xl);
    display: flex;
    justify-content: center;
    
    img {
      width: 170px;
      height: 255px;
      object-fit: cover;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-book);
    }
  }
  
  // Info Card with deeper beige background
  .info-card {
    background: var(--color-bg-deep-beige); // #EDE6D6 - V2 darker beige
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
    padding: var(--spacing-md);
    
    // Rating & Protagonist Row
    .rating-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-lg);
      flex-wrap: wrap;
      gap: var(--spacing-md);
      
      .rating-wrapper {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        
        .rating-count {
          color: var(--color-text-light);
          font-weight: 700;
          font-size: 0.95rem;
          margin-left: 2px;
          
          .total-ratings {
            font-size: 0.8rem;
            font-weight: 500;
            opacity: 0.7;
            margin-left: 4px;
          }
        }
      }

      .protagonist-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #F5F1E8; // Very soft sepia
        padding: 4px 12px;
        border-radius: var(--border-radius-full);
        border: 1px solid rgba(184, 149, 106, 0.2);
        
        .badge-icon {
          display: flex;
          color: var(--color-sepia-primary);
          
          svg {
            display: block;
          }
        }
        
        .badge-name {
          font-family: var(--font-main);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-sepia-dark);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        &.hercule-poirot {
          border-color: rgba(184, 149, 106, 0.4);
        }
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
      color: #8b6f47;
      font-size: 1rem;
      font-style: italic;
      margin: 0 0 var(--spacing-lg) 0;
    }
    

    
    // Metadata Grid
    .metadata-grid {
      display: flex;
      justify-content: center;
      margin-bottom: var(--spacing-xl);
      
      .meta-card {
        width: 100%;
        max-width: 200px;
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
    

  }
}

</style>
