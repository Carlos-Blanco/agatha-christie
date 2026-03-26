<template>
  <router-link :to="{ name: 'BookDetail', params: { slug: novel.slug, id: novel.id } }" class="book-card-link">
    <div class="novel-card">
      <div class="cover-wrapper">
        <img :src="displayImage" :alt="displayTitle" loading="lazy" @error="onImageError" />
        <div v-if="wasRead" class="badge read">
          <span class="badge-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          {{ $t('book_list.read') }}
        </div>
      </div>
      
      <div class="content-wrapper">
        <h3 class="novel-title">{{ displayTitle }}</h3>
        <p class="novel-subtitle">{{ novel.published }}</p>
        
        <div class="rating-row">
          <star-rating 
            v-bind:rating="averageRating"
            v-bind:read-only="true" 
            v-bind:star-size="14" 
            v-bind:show-rating="false"
            active-color="#f8a427"
            inactive-color="#d1d5db"
            v-bind:increment="0.1"
          ></star-rating>
          <span class="rating-value">{{ averageRating > 0 ? averageRating.toFixed(1) : '0.0' }}<span v-if="totalRatings > 0" class="rating-count"> ({{ totalRatings }})</span></span>
        </div>
        
        <p class="novel-summary">{{ displayDescription }}</p>
      </div>
    </div>
  </router-link>
</template>

<script>
import StarRating from "vue-star-rating";
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  name: "BookList",
  components: {
    StarRating
  },
  props: {
    novel: Object
  },
  data() {
    return {
      firestoreRating: null,
      totalRatings: 0
    };
  },
  created() {
    this.fetchRating();
  },
  methods: {
    onImageError(e) {
      if (this.novel?.image) e.target.src = this.novel.image;
    },
    async fetchRating() {
      if (!this.novel?.slug) return;
      try {
        const doc = await firebase.firestore().collection("rating").doc(this.novel.slug).get();
        if (doc.exists) {
          const data = doc.data();
          this.firestoreRating = data.averageRating || null;
          this.totalRatings = data.ratingCount || 0;
        }
      } catch (err) {
        console.error("Error fetching rating:", err);
      }
    }
  },
  computed: {
    averageRating() {
      if (this.firestoreRating !== null) return this.firestoreRating;
      return this.novel.rating || 0;
    },
    wasRead() {
      const readBooks = this.$store.state.user?.user?.readBooks || [];
      return readBooks.some(item =>
        String(item) === String(this.novel.id) ||
        String(item) === String(this.novel.slug)
      );
    },
    currentLang() {
      return this.$store.state.user.user.language;
    },
    displayImage() {
      if (!this.novel) return '';
      return (this.currentLang === 'en' && this.novel.image_en) ? this.novel.image_en : this.novel.image;
    },
    displayTitle() {
      if (!this.novel) return '';
      return (this.currentLang === 'en' && this.novel.title_en) ? this.novel.title_en : this.novel.title;
    },
    displayDescription() {
      if (!this.novel) return '';
      return (this.currentLang === 'en' && this.novel.description_en) ? this.novel.description_en : this.novel.description;
    }
  },
};
</script>

<style lang="scss" scoped>
.book-card-link {
  text-decoration: none;
  display: block;
  margin-bottom: var(--spacing-lg);
}

.novel-card {
  display: flex;
  background: var(--color-bg-white);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  gap: var(--spacing-md);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
}

.cover-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 110px;
  height: 160px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: calc(var(--border-radius) / 2);
    box-shadow: var(--shadow-book);
  }
  
  .badge {
    position: absolute;
    top: 8px;
    right: 0;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.5px;
    color: white;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    z-index: 2;
    
    &.read {
      background: #f8a427;
    }
    
    .badge-icon {
      display: flex;
      align-items: center;
    }
  }
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.novel-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-dark);
  line-height: 1.2;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.novel-subtitle {
  margin: 4px 0;
  font-size: 0.95rem;
  color: var(--color-sepia-dark);
  opacity: 0.8;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .rating-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-light);

    .rating-count {
      font-weight: 400;
      opacity: 0.7;
    }
  }
}

.novel-summary {
  margin: 6px 0 0;
  font-size: 0.9rem;
  color: var(--color-text-light);
  line-height: 1.4;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 480px) {
  .novel-card {
    gap: var(--spacing-sm);
  }
  
  .cover-wrapper {
    width: 90px;
    height: 130px;
  }
  
  .novel-title {
    font-size: 1.1rem;
  }
  
  .novel-summary {
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }
}
</style>
