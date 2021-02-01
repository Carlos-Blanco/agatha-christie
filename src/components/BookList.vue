<template>
  <router-link :to="{ name: 'BookDetail', params: { id: novel.id } }">
    <span class="novel">
      <span>
        <img :src="novel.image" :alt="novel.title" loading="lazy" />
      </span>
      <span>
        <h3>{{ novel.title }}</h3>
        <p>Published: {{ novel.published }}</p>
      </span>
    </span>
  </router-link>
</template>

<script>
export default {
  name: "BookList",
  props: {
    novel: Object
  }
};
</script>

<style lang="scss" scoped>
a {
  color: inherit;
}
.novel {
  display: flex;
  margin-bottom: 1.5rem;
  img {
    max-width: 100px;
    width: 100%;
    border-radius: var(--border-radius);
    box-shadow: 0 10px 15px -6px rgba(0, 0, 0, 0.7);
  }
  > span {
    &:first-of-type {
      min-width: 100px;
      margin-right: 1rem;
    }
  }
  h3 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }
  p {
    margin: 0;
    font-size: 1.1rem;
  }
}
</style>
