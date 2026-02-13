<template>
  <router-link :to="{ name: 'BookDetail', params: { slug: novel.slug, id: novel.id } }">
    <span class="novel">
      <span>
        <img :src="novel.image" :alt="novel.title" loading="lazy" />
        <span v-if="wasRead" class="was-read"></span>
      </span>
      <span>
        <h3>{{ novel.title }}</h3>
        <p>Publicado: {{ novel.published }}</p>
        <span v-if="novel.rate"> {{ novel.rate }}</span>
      </span>
    </span>
  </router-link>
</template>

<script>
export default {
  name: "BookList",
  props: {
    novel: Object
  },
  computed: {
    wasRead() {
      const wasRead = this.$store.state.user.user.readBooks;
      for (var i = 0; i < wasRead.length; i++) {
        if (wasRead[i] == this.novel.id) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  color: inherit;
  text-decoration: none;
}
.novel {
  display: flex;
  margin-bottom: var(--spacing-lg);
  background: var(--color-bg-white);
  border-radius: var(--border-radius);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  img {
    max-width: 100px;
    width: 100%;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-book);
  }
  > span {
    &:first-of-type {
      min-width: 100px;
      margin-right: var(--spacing-md);
      position: relative;
    }
  }
  h3 {
    margin-top: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--color-text-dark);
  }
  p {
    margin: 0;
    font-size: 1.1rem;
    color: var(--color-text-light);
  }
  .was-read {
    position: absolute;
    top: 0;
    right: 0.5rem;
    background: url(../assets/icons/icn-was-read.svg) center no-repeat;
    background-size: contain;
    width: 2rem;
    height: 2rem;
    display: inline-block;
  }
}
</style>
