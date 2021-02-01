<template>
  <div v-if="novel">
  <router-link to="/" class="btn--back">Back</router-link>
    <div>
      <img :src="novel.image" :alt="novel.title" />
    </div>
    <div class="novel-details">
      <a :href="novel.link" target="_blank" class="btn--buy">Buy Book</a>
      <h3>{{ novel.title }}</h3>
      <p>{{ novel.description }}</p>
    </div>
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";

export default {
  name: "BookDetail",
  props: ["id"],
  data() {
    return {
      novel: null
    };
  },
  created() {
    EventService.getNovels()
      .then(response => {
        this.novel = response.data[this.id];
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<style lang="scss" scoped>
.btn--back {
  margin: 0 1rem;
}
img {
  display: block;
  margin: 0 auto;
  max-width: 150px;
  width: 100%;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 15px -6px rgba(0, 0, 0, 0.7);
}
.novel-details {
  background: var(--color-background);
  border-radius: 50px 50px 0 0;
  padding: 1rem;
  margin-top: 2rem;
  min-height: calc(100vh - 330px);
  h3 {
    font-size: 2rem;
    font-weight: 900;
  }
  a.btn--buy {
    background: #f8a427;
    font-weight: bold;
    color: white;
    padding: 0.5rem 2rem;
    border-radius: var(--border-radius);
    float: right;
    margin-right: 2rem;
    &:hover {
      background: #ec9616;
    }
  }
}
</style>
