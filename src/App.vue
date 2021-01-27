<template>
  <div id="nav">
    <router-link to="/">Books</router-link> |
    <router-link to="/profile">Profile</router-link>
  </div>
  <router-view/>
</template>

<style lang="scss">
  /* TODO add css reset */
  body {
    padding: 0;
    margin: 0;
    line-height: 1.4;
    font-size: 1.2rem;
  }

:root {
  --color-header: hsl(255,27,29);
  --color-text: hsl(209,9,55);
  --color-background: #F1F6F8;

  --border-radius: 10px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 950px;
  margin: 0 auto;
  h1,h2 {
    color: var(--color-header);
  }
  h2 {
    font-size: 1.1rem;
    font-weight: 900;
    text-transform: uppercase;
    color: #008661;
  }
  h3, p {
    color: var(--color-text);
  }
  a {
    text-decoration: none;
    color: inherit;
  }
}

#nav {
  text-align: center;
  padding: 2rem 1rem 1rem;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
