<template>
  <router-view />
</template>

<script>
export default {
  created() {
    this.$store.dispatch("checkAuth");
  }
};
</script>

<style lang="scss">
@import "@/styles/_variables.scss";
@import "@/styles/_reset.scss";

#app {
  font-family: var(--font-main);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 950px;
  margin: 0 auto;
  h1,
  h2 {
    color: var(--color-header);
  }
  h2 {
    font-size: 1.1rem;
    font-weight: 900;
    text-transform: uppercase;
    color: var(--color-accent);
  }
  h3,
  p {
    color: var(--color-text);
  }
  .flex-wrapper {
    display: flex;
  }
  .legend-custom-style {
    &:after {
      content:"%";
      font-size: 0.8rem;
    }
  }
}
</style>
