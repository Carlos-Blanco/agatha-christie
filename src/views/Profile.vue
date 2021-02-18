<template>
  <div class="profile">
    <router-link :to="{ name: 'Home'}" class="btn--back">Back</router-link>
    <h2>Profile</h2>
    <div class="progress-wrapper">
      <div>
        <h3>Books Read</h3>
        <p>{{ readBooks }} / {{ totalBooks }}</p>
      </div>
      <div>
        <ve-progress 
        :progress="progress"
        color="#008661"
        :size="75"
        :thickness="8"
        empty-thickness="10%"
        :legend-formatter="({currentValue}) => new Intl.NumberFormat('en-EN').format(currentValue)">
        
        </ve-progress> 
      </div>
    </div>
    <span id="errorMessage" class="error" style="display:none;"></span>
    <div class="button-wrapper">
      <button @click="logout">Log out</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  data(){
    return {
      readBooks: this.$store.state.user.user.readBooks.length,
      totalBooks: this.$store.state.books.novels.length,
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
  .progress-wrapper {
    border-radius: var(--border-radius);
    background: linear-gradient(90deg, rgba(66,185,131,1) 0%, rgba(85,236,147,1) 100%);
    display: flex;
    padding: 0.5rem 1rem;
    justify-content: space-between;
    color: white;
    h3 {
      margin: 0.5rem 0;
    }
    p {
      margin: 0;
    }
    > div {
      &:last-of-type {
        > div {
          display: block;
        }
      }
    }
  }
  .button-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1rem 1rem 0.5rem;
  }
}
</style>
