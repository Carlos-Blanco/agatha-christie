<template>
  <router-link
    :to="{ name: 'BookDetail', params: { id: novel.id } }"
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
  margin-right: 1rem;
  img {
    border-radius: var(--border-radius);
    box-shadow: 0 10px 15px -6px rgba(0, 0, 0, 0.7);
    width: 100px;
  }
}
</style>
