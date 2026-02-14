<template>
  <router-link :to="{ name: 'BookDetail', params: { slug: novel.slug, id: novel.id } }" class="book-card-link">
    <div class="novel-card">
      <div class="cover-wrapper">
        <img :src="novel.image" :alt="displayTitle" loading="lazy" />
        <div class="badge" :class="wasRead ? 'read' : 'to-read'">
          <span class="badge-icon">
            <svg v-if="wasRead" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </span>
          {{ wasRead ? "LEÍDO" : "POR LEER" }}
        </div>
      </div>
      
      <div class="content-wrapper">
        <h3 class="novel-title">{{ displayTitle }}</h3>
        <p class="novel-subtitle">{{ novel.published }}</p>
        
        <div class="rating-row">
          <star-rating 
            v-bind:rating="displayRating" 
            v-bind:read-only="true" 
            v-bind:star-size="14" 
            v-bind:show-rating="false"
            active-color="#f8a427"
            inactive-color="#d1d5db"
            v-bind:increment="0.1"
          ></star-rating>
          <span class="rating-value">{{ displayRating > 0 ? displayRating.toFixed(1) : '0.0' }}</span>
        </div>
        
        <p class="novel-summary">{{ displayDescription }}</p>
      </div>
    </div>
  </router-link>
</template>

<script>
import StarRating from "vue-star-rating";
import firebase from "firebase/app";

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
      userRating: null
    };
  },
  created() {
    if (this.wasRead) {
      this.fetchUserRating();
    }
  },
  watch: {
    wasRead(newVal) {
      if (newVal) {
        this.fetchUserRating();
      }
    }
  },
  methods: {
    fetchUserRating() {
      const userUID = this.$store.state.user?.user?.userinfo;
      if (!userUID || !this.novel.slug) return;

      const db = firebase.firestore();
      db.collection("rating")
        .doc(this.novel.slug)
        .collection("users")
        .doc(userUID)
        .get()
        .then(doc => {
          if (doc.exists) {
            this.userRating = doc.data().bookrate;
          }
        })
        .catch(err => console.error("Error fetching list rating:", err));
    }
  },
  computed: {
    wasRead() {
      const readBooks = this.$store.state.user?.user?.readBooks || [];
      return readBooks.some(item => 
        String(item) === String(this.novel.id) || 
        String(item) === String(this.novel.slug)
      );
    },
    displayRating() {
      // Priority: 1. Locally fetched user rating, 2. Global rate from data, 3. Default 0
      if (this.userRating !== null) {
        return this.userRating;
      }
      return this.novel.rating || 0;
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
      background: #8e735b;
    }
    
    &.to-read {
      background: #757575;
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
