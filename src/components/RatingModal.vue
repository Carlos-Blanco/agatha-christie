<template>
  <transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h2>¡Lectura Completada!</h2>
          </div>

          <div class="modal-body">
            <p>Esperamos que hayas disfrutado de este misterio de Agatha Christie.</p>
            <div class="rating-section">
              <p class="rating-label">¿Cómo valorarías este libro?</p>
              <star-rating 
                v-model:rating="userRating" 
                v-bind:increment="1" 
                v-bind:max-rating="5" 
                v-bind:show-rating="false"
                v-bind:star-size="30"
                active-color="#f8a427">
              </star-rating>
            </div>
          </div>

          <div class="modal-footer">
            <button class="modal-btn modal-btn--secondary" @click="$emit('close')">
              Cerrar
            </button>
            <button class="modal-btn modal-btn--primary" :disabled="userRating === 0" @click="save">
              Guardar Valoración
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import StarRating from "vue-star-rating";

export default {
  name: "RatingModal",
  components: {
    StarRating
  },
  props: {
    show: Boolean
  },
  data() {
    return {
      userRating: 0
    };
  },
  methods: {
    save() {
      this.$emit("save", this.userRating);
      this.userRating = 0; // Reset for next time
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 90%;
  max-width: 450px;
  background-color: #FDFBF7; // Light beige
  border-radius: var(--border-radius-lg);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  padding: var(--spacing-xl);
  border: 1px solid rgba(139, 111, 71, 0.1);
  transition: all 0.3s ease;
}

.modal-header h2 {
  margin-top: 0;
  color: var(--color-text-dark);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  text-align: center;
}

.modal-body {
  margin: var(--spacing-lg) 0;
  text-align: center;
  
  p {
    color: var(--color-text-light);
    line-height: 1.6;
  }
}

.rating-section {
  background: #F5F1E8;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  
  .rating-label {
    font-weight: 600;
    color: var(--color-text-brown);
    font-size: 0.9rem;
    margin: 0;
  }
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: var(--spacing-xl);
}

.modal-btn {
  padding: 10px 24px;
  border-radius: var(--border-radius-full);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  
  &--primary {
    background: var(--color-sepia-primary);
    color: white;
    
    &:hover:not(:disabled) {
      background: #8b6f47;
      transform: translateY(-1px);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  &--secondary {
    background: transparent;
    color: var(--color-text-light);
    border: 1px solid rgba(0, 0, 0, 0.1);
    
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
}

// Vue Transition
.modal-enter-from { opacity: 0; }
.modal-leave-to { opacity: 0; }
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>
