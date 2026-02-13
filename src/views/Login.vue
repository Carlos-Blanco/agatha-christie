<template>
  <div class="login">
    <router-link :to="{ name: 'Home' }" class="btn--back">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      Atrás
    </router-link>
    <h2>Agatha Christie</h2>
    <p class="subtitle">Continúa tu misterio</p>
    <form @submit.prevent="login">
      <div>
        <input type="text" v-model="userinfo.email" placeholder="Correo electrónico" />
      </div>
      <div>
        <input type="password" v-model="userinfo.password" placeholder="Contraseña" />
      </div>
      <div v-if="user.user.authError" class="error">{{ user.user.authError }}</div>
      <button>Iniciar sesión</button>
    </form>
    <div class="signup-wrapper">
      <p><span></span>o<span></span></p>
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
  },
  watch: {
    userinfo: {
      handler() {
        if (this.user.user.authError) {
          this.$store.commit("CLEAR_AUTH_ERROR");
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-xl);
  background: var(--color-bg-white);
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text-dark);
    margin-bottom: var(--spacing-sm);
    text-align: center;
  }
  
  .subtitle {
    text-align: center;
    color: var(--color-text-light);
    font-size: 1rem;
    margin-bottom: var(--spacing-2xl);
  }
  
  form {
    background: var(--color-bg-warm-beige);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-lg);
    margin-bottom: var(--spacing-lg);
  }
  
  input {
    background: var(--color-bg-white);
    border-radius: var(--border-radius);
    border: 1px solid transparent;
    height: 3.5rem;
    font-size: 1.1rem;
    color: var(--color-text-dark);
    width: 100%;
    padding: 0 var(--spacing-md);
    margin-bottom: var(--spacing-md);
    font-family: var(--font-main);
    transition: all 0.2s ease;
    
    &::placeholder {
      color: var(--color-text-light);
    }
    
    &:focus {
      outline: none;
      border-color: var(--color-sepia-primary);
      box-shadow: var(--shadow-sm);
    }
  }
  
  button {
    height: 3.5rem;
    background: var(--color-sepia-primary);
    border-radius: var(--border-radius);
    border: none;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    width: 100%;
    cursor: pointer;
    font-family: var(--font-main);
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--color-sepia-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  .error {
    background: #ff5e58;
    color: white;
    min-height: 3rem;
    border-radius: var(--border-radius);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    display: flex;
    align-items: center;
  }
  
  .btn--back {
    position: absolute;
    top: var(--spacing-xl);
    left: var(--spacing-lg);
    color: var(--color-sepia-dark);
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    transition: color 0.2s ease;
    font-family: var(--font-main);
    display: flex;
    align-items: center;
    gap: 4px;
    
    svg {
      transition: transform 0.2s ease;
    }
    
    &:hover {
      color: var(--color-sepia-primary);
      
      svg {
        transform: translateX(-2px);
      }
    }
  }
}

.signup-wrapper {
  text-align: center;
  
  p {
    line-height: 0.5;
    text-align: center;
    display: flex;
    margin: var(--spacing-xl) 0;
    color: var(--color-text-light);
    
    span {
      display: inline-block;
      position: relative;
      width: 100%;
      height: 5px;
      border-bottom: 1px solid #e0e0e0;
      top: 0;
      
      &:first-of-type {
        margin-right: var(--spacing-md);
      }
      
      &:last-of-type {
        margin-left: var(--spacing-md);
      }
    }
  }
  
  .btn {
    display: block;
    border: 2px solid var(--color-sepia-primary);
    background: var(--color-bg-white);
    color: var(--color-sepia-primary);
    height: 3.5rem;
    border-radius: var(--border-radius);
    font-size: 1.1rem;
    font-weight: 600;
    width: 100%;
    cursor: pointer;
    padding-top: 10px;
    text-decoration: none;
    transition: all 0.2s ease;
    font-family: var(--font-main);
    
    &:hover {
      background: var(--color-sepia-primary);
      color: white;
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
  }
}
</style>
