<template>
  <div class="wrapper-404">
    <h1>Oops!!</h1>
    <h3>The page you're looking for is not here.</h3>
    <router-link :to="{ name: 'Home' }" class="btn">Back</router-link>
  </div>
</template>

<style lang="scss" scoped>
.wrapper-404 {
  margin: 1rem;
  .btn {
    text-align: center;
    display: block;
    height: 3rem;
    background: #008661;
    border-radius: var(--border-radius);
    border: none;
    color: white;
    font-size: 1.2rem;
    width: 100%;
    cursor: pointer;
    font-weight: bold;
    padding-top: 0.6rem;
  }
}
</style>