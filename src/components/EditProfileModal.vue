<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Editar Perfil</h2>
        <button class="btn-close" @click="$emit('close')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <!-- Avatar Preview -->
        <div class="avatar-section">
          <div class="avatar-preview">
            <img v-if="photoPreview" :src="photoPreview" alt="Preview" />
            <svg v-else width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <label class="btn-upload">
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/jpg" 
              @change="handleFileSelect"
              ref="fileInput"
            />
            Seleccionar Foto
          </label>
          <p class="upload-hint">JPG o PNG, máx. 5MB</p>
        </div>
        
        <!-- Display Name Input -->
        <div class="form-group">
          <label for="displayName">Nombre de Usuario</label>
          <input 
            id="displayName"
            v-model="localDisplayName" 
            type="text" 
            placeholder="Ingresa tu nombre"
            maxlength="50"
          />
          <p class="input-hint">{{ localDisplayName.length }}/50 caracteres</p>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')" :disabled="uploading">
          Cancelar
        </button>
        <button class="btn-primary" @click="handleSave" :disabled="uploading || !isValid">
          <span v-if="uploading">Guardando...</span>
          <span v-else>Guardar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditProfileModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    userData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      localDisplayName: '',
      selectedFile: null,
      photoPreview: null,
      uploading: false
    };
  },
  computed: {
    isValid() {
      return this.localDisplayName.trim().length > 0 || this.selectedFile !== null;
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.localDisplayName = this.userData.displayName || '';
        this.photoPreview = this.userData.photoURL || null;
        this.selectedFile = null;
      }
    }
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La foto debe ser menor a 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        alert('Solo se permiten archivos JPG o PNG');
        return;
      }
      
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    handleSave() {
      this.$emit('save', {
        displayName: this.localDisplayName.trim(),
        photoFile: this.selectedFile
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-content {
  background: var(--color-bg-white);
  border-radius: var(--border-radius-lg);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-bg-warm-beige);
  
  h2 {
    color: var(--color-text-dark);
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }
  
  .btn-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--spacing-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius);
    transition: all 0.2s ease;
    
    svg {
      color: var(--color-text-light);
    }
    
    &:hover {
      background: var(--color-bg-warm-beige);
      
      svg {
        color: var(--color-sepia-dark);
      }
    }
  }
}

.modal-body {
  padding: var(--spacing-xl);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  
  .avatar-preview {
    width: 120px;
    height: 120px;
    border-radius: var(--border-radius-full);
    background: var(--color-bg-warm-beige);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-md);
    overflow: hidden;
    border: 3px solid var(--color-sepia-primary);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    svg {
      color: var(--color-text-light);
    }
  }
  
  .btn-upload {
    background: var(--color-sepia-primary);
    color: white;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    margin-bottom: var(--spacing-xs);
    
    input[type="file"] {
      display: none;
    }
    
    &:hover {
      background: var(--color-sepia-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
  }
  
  .upload-hint {
    font-size: 0.85rem;
    color: var(--color-text-light);
    margin: 0;
  }
}

.form-group {
  margin-bottom: var(--spacing-lg);
  
  label {
    display: block;
    color: var(--color-text-dark);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
  }
  
  input[type="text"] {
    width: 100%;
    padding: var(--spacing-md);
    border: 2px solid var(--color-bg-warm-beige);
    border-radius: var(--border-radius);
    font-size: 1rem;
    color: var(--color-text-dark);
    font-family: var(--font-main);
    transition: all 0.2s ease;
    
    &::placeholder {
      color: var(--color-text-light);
    }
    
    &:focus {
      outline: none;
      border-color: var(--color-sepia-primary);
      background: var(--color-bg-white);
      box-shadow: var(--shadow-sm);
    }
  }
  
  .input-hint {
    font-size: 0.85rem;
    color: var(--color-text-light);
    margin: var(--spacing-xs) 0 0 0;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-bg-warm-beige);
  
  button {
    padding: var(--spacing-sm) var(--spacing-xl);
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    font-size: 1rem;
    font-family: var(--font-main);
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .btn-secondary {
    background: transparent;
    color: var(--color-text-dark);
    border: 2px solid var(--color-bg-warm-beige);
    
    &:hover:not(:disabled) {
      background: var(--color-bg-warm-beige);
    }
  }
  
  .btn-primary {
    background: var(--color-sepia-primary);
    color: white;
    
    &:hover:not(:disabled) {
      background: var(--color-sepia-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
  }
}
</style>
