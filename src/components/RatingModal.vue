<template>
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
            <StarRating 
              v-model:rating="userRating" 
              :increment="1" 
              :max-rating="5" 
              :show-rating="false"
              :star-size="30"
              active-color="#f8a427">
            </StarRating>
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
      this.userRating = 0;
    }
  }
};
</script>

<style scoped>
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
}

.modal-container {
  width: 90%;
  max-width: 450px;
  background-color: #FDFBF7;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  padding: 32px;
  border: 1px solid rgba(139, 111, 71, 0.1);
  margin: 0 auto;
}

.modal-header h2 {
  margin-top: 0;
  color: #2c3e50;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  text-align: center;
}

.modal-body {
  margin: 24px 0;
  text-align: center;
}

.modal-body p {
  color: #5c5c5c;
  line-height: 1.6;
}

.rating-section {
  background: #F5F1E8;
  padding: 24px;
  border-radius: 12px;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.rating-label {
  font-weight: 600;
  color: #8b6f47;
  font-size: 0.9rem;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.modal-btn {
  padding: 10px 24px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.modal-btn--primary {
  background: #b8956a;
  color: white;
}

.modal-btn--primary:hover:not(:disabled) {
  background: #8b6f47;
  transform: translateY(-1px);
}

.modal-btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-btn--secondary {
  background: transparent;
  color: #5c5c5c;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-btn--secondary:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
