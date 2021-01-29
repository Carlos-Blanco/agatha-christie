<template>
  <div class="profile">
    <h2>Profile</h2>
    <span id="errorMessage" class="error" style="display:none;"></span>
    <button @click="logout">Log out</button>
  </div>
</template>

<script>
import firebase from "firebase";
require("firebase/auth");

export default {
  name: "Login",
  methods: {
    logout() {
      firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log("Log Out")
      }).catch((error) => {
        var errorMessage = error.message;
        var logoutError = document.getElementById("errorMessage");
        logoutError.style.display = "block";
        logoutError.textContent += errorMessage;
      });
    }
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
