<template>
  <div class="login">
    <router-link :to="{ name: 'Home' }" class="btn--back">Back</router-link>
    <h2>Iniciar sesión</h2>
    <form @submit.prevent="login">
      <div>
        <input type="text" v-model="userinfo.email" placeholder="Email" />
      </div>
      <div>
        <input type="password" v-model="userinfo.password" placeholder="Password" />
      </div>
      <span id="errorMessage" class="error" style="display:none;"></span>
      <button>Iniciar sesión</button>
    </form>
    <div class="signup-wrapper">
      <p><span></span>or<span></span></p>
      <router-link :to="{ name: 'SignUp' }" class="btn">Registrarse</router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      userinfo: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      this.$store.dispatch("login", this.userinfo);
    }
  },
  computed: {
    ...mapState(["user"])
  }
};
</script>

<style lang="scss" scoped>
.login {
  margin: 1rem;
  input {
    background: #f7f7f7;
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
.signup-wrapper {
  text-align: center;
  p {
    line-height: 0.5;
    text-align: center;
    display: flex;
    margin: 2.5rem 0;
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
    background: #f7f7f7;
    color: var(--color-text);
    height: 3rem;
    border-radius: var(--border-radius);
    font-size: 1.2rem;
    width: 100%;
    cursor: pointer;
    padding-top: 10px;
  }
}
</style>
