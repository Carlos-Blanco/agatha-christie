<template>
  <div class="profile">
    <router-link :to="{ name: 'Home'}" class="btn--back">Back</router-link>
    <h2>Profile</h2>
    <ve-progress 
    :progress="progress"
    color="#008661"
    :size="150"
    :thickness="12"
    empty-thickness="10%"
    :legend-formatter="({currentValue}) => new Intl.NumberFormat('en-EN').format(currentValue)">
    
    </ve-progress> 
    <span id="errorMessage" class="error" style="display:none;"></span>
    <button @click="logout">Log out</button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  data(){
    return {
      progress: (this.$store.state.user.user.readBooks.length * 100) / this.$store.state.books.novels.length
    };
  },
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
