<template>
  <div class="login">
    <h2>Log in</h2>
    <form @submit.prevent="login">
      <div>
        <input type="text" v-model="email" placeholder="Email">
      </div>
      <div>
        <input type="password" v-model="password" placeholder="Password">
      </div>
      <button>Log in</button>
    </form>
    <div class="signup-wrapper">
      <p><span></span>or<span></span></p>
      <router-link to="/signup" class="btn">Sign up</router-link>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
require('firebase/auth')

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: ""
    }
  },
  methods: {
    login() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
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
};
</script>

<style lang="scss" scoped>
.login {
  margin: 1rem;
  input {
    background: #F7F7F7;
    border-radius: var(--border-radius);
    border: none;
    height: 3rem;
    font-size: 1.2rem;
    color: var(--color-text);
    width: 100%;
    padding-left: 1rem;
    margin-bottom: 1rem;
  }
  button {
    height: 3rem;
    background: #008661;
    border-radius: var(--border-radius);
    border: none;
    color: white;
    font-size: 1.2rem;
    width: 100%;
    cursor: pointer;
  }
}
.signup-wrapper {
  text-align: center;
  p {
    line-height: 0.5;
    text-align: center;
    display: flex;
    margin: 3rem 0;
    color: #c7c7c7;
    span {
      display: inline-block;
      position: relative;
      width: 100%;
      height: 5px;
      border-bottom: 1px solid #c7c7c7;
      top: 0;
      &:first-of-type {
        margin-right: 1rem;
      }
      &:last-of-type {
        margin-left: 1rem;
      }
    }
  }
  .btn {
    display: block;
    border: 1px solid #cecece;
    background: #F7F7F7;
    height: 3rem;
    border-radius: var(--border-radius);
    font-size: 1.2rem;
    width: 100%;
    cursor: pointer;
    padding-top: 10px;
  }
}
</style>