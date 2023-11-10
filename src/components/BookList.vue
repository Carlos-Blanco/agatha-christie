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
      position: relative;
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
