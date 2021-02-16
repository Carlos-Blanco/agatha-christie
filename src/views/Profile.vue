<template>
  <div class="profile">
    <router-link :to="{ name: 'Home'}" class="btn--back">Back</router-link>
    <h2>Profile</h2>
    <ve-progress :progress="50"/>
    <span id="errorMessage" class="error" style="display:none;"></span>
    <button @click="logout">Log out</button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  },
  computed: {
    ...mapState(["user"])
  }
};
</script>

<style lang="scss" scoped>
.profile {
  margin: 1rem;
  button {
    height: 3rem;
    background: #008661;
    border-radius: var(--border-radius);
    border: none;
    color: white;
    font-size: 1.2rem;
    width: 100%;
    cursor: pointer;
    font-weight: bold;
  }
  .error {
    background: #ff5e58;
    color: white;
    min-height: 3rem;
    border-radius: var(--border-radius);
    padding: 0.7rem 1rem;
    margin-bottom: 1rem;
  }
}
</style>
