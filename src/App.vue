<template>
  <router-view />
</template>

<style lang="scss">
/* TODO add css reset */
body {
  padding: 0;
  margin: 0;
  line-height: 1.4;
  font-size: 1.2rem;
}
* {
  box-sizing: border-box;
}

:root {
  --color-header: hsl(255, 27, 29);
  --color-text: hsl(209, 9, 55);
  --color-background: #f1f6f8;

  --border-radius: 10px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 950px;
  margin: 1.5rem auto 0;
  h1,
  h2 {
    color: var(--color-header);
  }
  h2 {
    font-size: 1.1rem;
    font-weight: 900;
    text-transform: uppercase;
    color: #008661;
  }
  h3,
  p {
    color: var(--color-text);
  }
  a {
    text-decoration: none;
  }
  .btn--back {
    display: block;
    font-weight: bold;
    color: var(--color-header);
    &:before {
      content: "";
      width: 1.5rem;
      height: 1.5rem;
      background: url(/img/icons/icn-back.svg) center no-repeat;
      position: relative;
      top: 5px;
      display: inline-block;
      background-size: contain;
      margin-right: 0.3rem;
    }
  }
  .flex-wrapper {
    display: flex;
  }
}
</style>
