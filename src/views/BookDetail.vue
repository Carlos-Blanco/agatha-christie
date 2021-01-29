<template>
  <router-link to="/" class="btn--back">Back</router-link>
  <div v-if="novel">
    <div>
      <img :src="novel.image" :alt="novel.title" />
    </div>
    <div class="novel-details">
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
  height: 50vh;
  h3 {
    font-size: 2rem;
    font-weight: 900;
  }
}
</style>
