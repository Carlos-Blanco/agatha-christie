<template>
  <div class="profile">
    <router-link :to="{ name: 'Home'}" class="btn--back">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      Atrás
    </router-link>
    
    <!-- Header -->
    <div class="profile-header">
      <h2>Mi Perfil</h2>
    </div>
    
    <!-- User Info Card -->
    <div class="user-info">
      <div class="avatar-large">
        <img v-if="userPhotoURL" :src="userPhotoURL" alt="Avatar" />
        <svg v-else width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <h3>{{ userDisplayName }}</h3>
      <p class="member-since">Miembro desde {{ memberSince }}</p>
      <button @click="showEditModal = true" class="btn-edit">Editar Perfil</button>
    </div>
    
    <!-- Edit Profile Modal -->
    <EditProfileModal 
      :show="showEditModal" 
      :userData="userData"
      @close="showEditModal = false"
      @save="saveProfile"
    />
    
    <!-- Reading Progress Circle -->
    <div class="progress-section">
      <h3>Progreso de Lectura</h3>
      <div class="progress-container">
        <ve-progress
          :progress="progress"
          color="#B8956A"
          :size="180"
          :thickness="12"
          empty-thickness="10%"
          legendClass="legend-custom-style">
        </ve-progress>
        <p class="progress-text">{{ readBooks }} of {{ totalBooks }} books</p>
      </div>
    </div>
    
    <!-- Recently Read -->
    <div class="recently-read" v-if="recentBooks.length > 0">
      <div class="section-header">
        <h3>Leídos Recientemente</h3>
        <router-link :to="{ name: 'ReadingHistory' }" class="view-all">
          Ver todo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </router-link>
      </div>
      <div class="books-scroll">
        <div v-for="book in recentBooks" :key="book.slug" class="book-item">
          <img :src="book.image" :alt="book.title" />
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="action-buttons">
      <router-link :to="{ name: 'ReadingHistory' }" class="btn-action">Ver Historial de Lectura</router-link>
      <button class="btn-action">Gestionar Colecciones</button>
    </div>
    
    <!-- Sign Out -->
    <div class="signout-section">
      <button @click="logout" class="btn-signout">Cerrar sesión</button>
    </div>
    
    <span id="errorMessage" class="error" style="display:none;"></span>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EditProfileModal from '@/components/EditProfileModal.vue';
import firebase from 'firebase';

export default {
  name: "Profile",
  components: {
    EditProfileModal
  },
  data(){
    return {
      currentlyReading: 3,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      recentBooks: [],
      showEditModal: false,
      userPhotoURL: null,
      userDisplayName: '',
      userEmail: ''
    };
  },
  async mounted() {
    // Load books if not already loaded
    if (this.$store.state.books.novels.length === 0) {
      await this.$store.dispatch('fetchNovels');
    }
    
    // Get last 5 read books
    const readBookSlugs = this.$store.state.user.user.readBooks.slice(-5);
    this.recentBooks = this.$store.state.books.novels
      .filter(novel => readBookSlugs.includes(novel.slug))
      .slice(0, 5);
    
    // Load user profile data
    await this.loadUserProfile();
  },
  computed: {
    userData() {
      return {
        displayName: this.userDisplayName,
        photoURL: this.userPhotoURL,
        email: this.userEmail
      };
    },
    readBooks() {
      return this.$store.state.user?.user?.readBooks?.length || 0;
    },
    totalBooks() {
      return this.$store.state.books?.novels?.length || 0;
    },
    progress() {
      return this.totalBooks > 0 ? Math.floor((this.readBooks * 100) / this.totalBooks) : 0;
    },
    ...mapState(["user", "books"])
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
    async loadUserProfile() {
      try {
        const uid = this.$store.state.user.user.userinfo;
        const userDoc = await firebase.firestore().collection('users').doc(uid).get();
        
        if (userDoc.exists) {
          const data = userDoc.data();
          this.userPhotoURL = data.photoURL || null;
          this.userDisplayName = data.displayName || this.$store.state.user.user.email || 'Usuario';
          this.userEmail = this.$store.state.user.user.email || '';
        } else {
          // Fallback to email if no profile exists
          this.userDisplayName = this.$store.state.user.user.email || 'Usuario';
          this.userEmail = this.$store.state.user.user.email || '';
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        this.userDisplayName = 'Usuario';
      }
    },
    
    async saveProfile({ displayName, photoFile }) {
      try {
        const uid = this.$store.state.user.user.userinfo;
        let photoURL = this.userPhotoURL;
        
        // Upload photo if provided
        if (photoFile) {
          const storageRef = firebase.storage().ref(`profile-photos/${uid}/avatar.jpg`);
          await storageRef.put(photoFile);
          photoURL = await storageRef.getDownloadURL();
          this.userPhotoURL = photoURL;
        }
        
        // Save to Firestore
        await firebase.firestore().collection('users').doc(uid).set({
          displayName: displayName || this.userEmail,
          photoURL: photoURL,
          email: this.userEmail,
          updatedAt: new Date()
        }, { merge: true });
        
        // Update local state
        this.userDisplayName = displayName || this.userEmail;
        this.showEditModal = false;
        
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error al guardar el perfil. Por favor intenta de nuevo.');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.profile {
  min-height: 100vh;
  padding: var(--spacing-xl) var(--spacing-md) var(--spacing-2xl);
  background: var(--color-bg-white);
  
  .btn--back {
    position: absolute;
    top: var(--spacing-xl);
    left: var(--spacing-lg);
    color: var(--color-sepia-dark);
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    z-index: 10;
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
  
  .profile-header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
    padding-top: var(--spacing-md);
    
    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text-dark);
      margin: 0;
    }
  }
  
  // User Info Card
  .user-info {
    text-align: center;
    background: var(--color-bg-warm-beige);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    
    .avatar-large {
      margin: 0 auto var(--spacing-md);
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-bg-warm-beige);
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      svg {
        color: var(--color-sepia-primary);
        flex-shrink: 0;
      }
    }
    
    h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text-dark);
      margin: 0 0 var(--spacing-xs) 0;
    }
    
    .member-since {
      color: var(--color-text-light);
      font-size: 0.9rem;
      margin: 0 0 var(--spacing-lg) 0;
    }
    
    .btn-edit {
      background: var(--color-sepia-primary);
      color: white;
      border: none;
      padding: var(--spacing-sm) var(--spacing-xl);
      border-radius: var(--border-radius);
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: var(--font-main);
      
      &:hover {
        background: var(--color-sepia-dark);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }
    }
  }
  
  // Progress Section
  .progress-section {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
    
    h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--color-text-dark);
      margin-bottom: var(--spacing-lg);
    }
    
    .progress-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-md);
      
      .progress-text {
        color: var(--color-text-light);
        font-size: 1rem;
        font-weight: 500;
        margin: 0;
      }
    }
  }
  
  // Recently Read Section
  .recently-read {
    margin-bottom: var(--spacing-2xl);
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }
    
    h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--color-text-dark);
      margin: 0;
    }
    
    .view-all {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--color-sepia-primary);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius);
      transition: all 0.2s ease;
      
      svg {
        transition: transform 0.2s ease;
      }
      
      &:hover {
        background: var(--color-bg-warm-beige);
        
        svg {
          transform: translateX(2px);
        }
      }
    }
    
    .books-scroll {
      display: flex;
      gap: var(--spacing-md);
      overflow-x: auto;
      padding-bottom: var(--spacing-sm);
      scroll-snap-type: x proximity;
      
      &::-webkit-scrollbar {
        height: 6px;
      }
      
      &::-webkit-scrollbar-track {
        background: var(--color-bg-warm-beige);
        border-radius: 2px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: var(--color-sepia-primary);
        border-radius: var(--border-radius);
      }
      
      .book-item {
        flex-shrink: 0;
        scroll-snap-align: start;
        
        img {
          width: 100px;
          height: 150px;
          object-fit: cover;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-book);
          transition: transform 0.2s ease;
          
          &:hover {
            transform: scale(1.05);
          }
        }
      }
    }
  }
  
  // Action Buttons
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    
    .btn-action {
      width: 100%;
      height: 3.5rem;
      background: var(--color-sepia-primary);
      border: none;
      color: white;
      border-radius: var(--border-radius);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: var(--font-main);
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background: var(--color-sepia-dark);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }
    }
  }
  
  // Sign Out Section
  .signout-section {
    text-align: center;
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--color-bg-deep-beige);
    
    .btn-signout {
      background: transparent;
      border: none;
      color: var(--color-text-light);
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: underline;
      font-family: var(--font-main);
      padding: var(--spacing-sm);
      transition: color 0.2s ease;
      
      &:hover {
        color: var(--color-sepia-primary);
      }
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
}

// Custom styling for large progress circle
::v-deep .legend-custom-style {
  color: var(--color-sepia-primary) !important;
  font-weight: 700 !important;
  font-size: 2rem !important;
}
</style>
