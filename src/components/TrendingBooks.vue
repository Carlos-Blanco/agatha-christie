<template>
  <router-link
    :to="{ name: 'BookDetail', params: { slug: novel.slug, id: novel.id } }"
    class="novel"
  >
    <img :src="displayImage" :alt="displayTitle" loading="lazy" />
    <div class="rating-info">
      <star-rating
        v-bind:rating="averageRating"
        v-bind:read-only="true"
        v-bind:star-size="11"
        v-bind:show-rating="false"
        v-bind:increment="0.1"
        active-color="#f8a427"
        inactive-color="#d1d5db"
      ></star-rating>
      <span class="rating-text">{{ averageRating > 0 ? averageRating.toFixed(1) : '—' }}<span v-if="totalRatings > 0" class="rating-count"> ({{ totalRatings }})</span></span>
    </div>
  </router-link>
</template>

<script>
import StarRating from "vue-star-rating";
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  name: "TrendingBooks",
  components: { StarRating },
  props: {
    novel: Object
  },
  data() {
    return {
      averageRating: 0,
      totalRatings: 0
    };
  },
  computed: {
    displayTitle() {
      if (!this.novel) return '';
      return this.$i18n.locale === 'en' && this.novel.title_en ? this.novel.title_en : this.novel.title;
    },
    displayImage() {
      if (!this.novel) return '';
      return (this.$i18n.locale === 'en' && this.novel.image_en) ? this.novel.image_en : this.novel.image;
    }
  },
  created() {
    this.fetchRating();
  },
  methods: {
    async fetchRating() {
      if (!this.novel?.slug) return;
      try {
        const doc = await firebase.firestore().collection("rating").doc(this.novel.slug).get();
        if (doc.exists) {
          const data = doc.data();
          this.averageRating = data.averageRating || 0;
          this.totalRatings = data.ratingCount || 0;
        }
      } catch (e) {
        // silencioso
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.novel {
  scroll-snap-align: center;
  margin-right: var(--spacing-md);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    display: block;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-book);
    width: 100px;
  }

  .rating-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    margin-top: 6px;

    .rating-text {
      font-size: 0.7rem;
      color: var(--color-text-light);
      line-height: 1;

      .rating-count {
        opacity: 0.7;
      }
    }
  }
}
</style>
