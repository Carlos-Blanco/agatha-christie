<template>
  <router-link
    :to="{ name: 'BookDetail', params: { slug: novel.slug, id: novel.id } }"
    class="novel"
  >
    <img :src="displayImage" :alt="displayTitle" loading="lazy" @error="onImageError" />
  </router-link>
</template>

<script>
export default {
  name: "TrendingBooks",
  props: {
    novel: Object
  },
  methods: {
    onImageError(e) {
      if (this.novel?.image) e.target.src = this.novel.image;
    }
  },
  computed: {
    currentLang() {
      return this.$store.state.user.user.language;
    },
    displayTitle() {
      if (!this.novel) return '';
      return (this.currentLang === 'en' && this.novel.title_en) ? this.novel.title_en : this.novel.title;
    },
    displayImage() {
      if (!this.novel) return '';
      return (this.currentLang === 'en' && this.novel.image_en) ? this.novel.image_en : this.novel.image;
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
    height: 150px;
    object-fit: cover;
  }
}
</style>
