<template>
  <div class="profile">
    <h2>SignUp</h2>
    <form @submit.prevent="register">
      <label>Email</label>
      <input type="text" v-model="email" placeholder="Email">
      <label>Password</label>
      <input type="password" v-model="password" placeholder="Password">
      <button>SignUp</button>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase'
require('firebase/auth')

export default {
  name: "SignUp",
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    register() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log(user);
      })
        .catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
        console.log(errorCode + ' ' + errorMessage);
        });
    }
  }
}
</script>


<style lang="scss" scoped>
.profile {
  margin: 1rem;
}
</style>