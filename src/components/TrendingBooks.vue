<template>
  <router-link
    :to="{ name: 'BookDetail', params: { slug: novel.slug, id: novel.id } }"
    class="novel"
  >
    <img :src="displayImage" :alt="displayTitle" loading="lazy" />
  </router-link>
</template>

<script>
export default {
  name: "TrendingBooks",
  props: {
    novel: Object
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
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-book);
    width: 100px;
  }
}
</style>
