<template>
  <router-link
    :to="{ name: 'BookDetail', params: { slug: novel.slug, id: novel.id } }"
    class="novel"
  >
    <img :src="novel.image" :alt="novel.title" loading="lazy" />
  </router-link>
</template>

<script>
export default {
  name: "TrendingBooks",
  props: {
    novel: Object
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
