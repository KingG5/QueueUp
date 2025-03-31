<template>
    <div class="barbers-management">
      <div class="page-header">
        <h1>Gestion des Coiffeurs</h1>
        <button class="btn btn-primary" @click="showAddBarberModal = true">
          <span class="icon">+</span> Ajouter un coiffeur
        </button>
      </div>
      
      <div class="barbers-stats">
        <div class="stat-card">
          <h3>Total Coiffeurs</h3>
          <div class="stat-value">{{ barbersList.length }}</div>
        </div>
        <div class="stat-card">
          <h3>Coiffeurs Actifs</h3>
          <div class="stat-value">{{ activeBarbers.length }}</div>
        </div>
        <div class="stat-card">
          <h3>Clients Aujourd'hui</h3>
          <div class="stat-value">{{ totalClientsToday }}</div>
        </div>
        <div class="stat-card">
          <h3>Performance Moyenne</h3>
          <div class="stat-value">{{ averageRating }}/5</div>
        </div>
      </div>
      
      <div class="barbers-container">
        <div class="barbers-list">
          <div v-for="barber in barbersList" :key="barber.id" class="barber-card">
            <div class="barber-header">
              <div class="barber-status" :class="{ active: barber.isActive }"></div>
              <div class="barber-photo" v-if="barber.photo">
                <img :src="barber.photo" :alt="barber.name">
              </div>
              <div class="barber-photo barber-placeholder" v-else>
                {{ getInitials(barber.name) }}
              </div>
            </div>
            
            <div class="barber-info">
              <h3 class="barber-name">{{ barber.name }}</h3>
              <div class="barber-rating">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= barber.rating }">★</span>
                <span class="rating-value">({{ barber.rating }})</span>
              </div>
              
              <div class="barber-specialties">
                <span 
                  v-for="specialty in barber.specialties" 
                  :key="specialty" 
                  class="specialty-tag"
                >
                  {{ specialty }}
                </span>
              </div>
            </div>
            
            <div class="barber-stats">
              <div class="barber-stat">
                <span class="label">Clients aujourd'hui:</span>
                <span class="value">{{ barber.clientsToday }}</span>
              </div>
              <div class="barber-stat">
                <span class="label">Temps moyen:</span>
                <span class="value">{{ barber.averageTime }} min</span>
              </div>
            </div>
            
            <div class="barber-schedule">
              <h4>Horaire</h4>
              <div class="schedule-days">
                <div 
                  v-for="day in days" 
                  :key="day.value" 
                  class="day-tag" 
                  :class="{ active: barber.workDays.includes(day.value) }"
                >
                  {{ day.label }}
                </div>
              </div>
              <div class="schedule-hours">
                {{ barber.workHours }}
              </div>
            </div>
            
            <div class="barber-actions">
              <button 
                class="btn btn-sm" 
                :class="barber.isActive ? 'btn-warning' : 'btn-success'"
                @click="toggleBarberStatus(barber.id)"
              >
                {{ barber.isActive ? 'Mettre en pause' : 'Activer' }}
              </button>
              <button class="btn btn-sm btn-primary" @click="editBarber(barber.id)">
                Modifier
              </button>
              <button class="btn btn-sm btn-danger" @click="confirmDeleteBarber(barber.id)">
                Supprimer
              </button>
            </div>
          </div>
          
          <div v-if="barbersList.length === 0" class="empty-state">
            <div class="empty-icon">👨‍💇‍♂️</div>
            <h3>Aucun coiffeur</h3>
            <p>Ajoutez des coiffeurs pour commencer à gérer votre équipe.</p>
            <button class="btn btn-primary" @click="showAddBarberModal = true">
              Ajouter un coiffeur
            </button>
          </div>
        </div>
      </div>
      
      <!-- Add/Edit Barber Modal -->
      <div v-if="showAddBarberModal || editingBarberId" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editingBarberId ? 'Modifier le coiffeur' : 'Ajouter un coiffeur' }}</h2>
            <button class="close-btn" @click="closeBarberModal">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="form-group">
              <label>Nom du coiffeur</label>
              <input 
                type="text" 
                v-model="barberForm.name" 
                placeholder="Nom complet"
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label>Photo du coiffeur</label>
              <div class="photo-upload">
                <div class="preview-container">
                  <img v-if="imagePreview" :src="imagePreview" alt="Aperçu" class="photo-preview">
                  <div v-else class="photo-placeholder">
                    <span v-if="barberForm.name">{{ getInitials(barberForm.name) }}</span>
                    <span v-else>Photo</span>
                  </div>
                </div>
                <div class="upload-actions">
                  <label class="upload-btn">
                    <input type="file" accept="image/*" @change="handlePhotoUpload" class="hidden-input">
                    <span class="btn btn-outline">Choisir une photo</span>
                  </label>
                  <button v-if="imagePreview" type="button" class="btn btn-sm btn-danger" @click="removePhoto">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label>Spécialités</label>
              <div class="checkbox-group">
                <label class="checkbox" v-for="service in availableServices" :key="service">
                  <input 
                    type="checkbox" 
                    :value="service" 
                    v-model="barberForm.specialties"
                  >
                  {{ service }}
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label>Jours de travail</label>
              <div class="checkbox-group">
                <label class="checkbox" v-for="day in days" :key="day.value">
                  <input 
                    type="checkbox" 
                    :value="day.value" 
                    v-model="barberForm.workDays"
                  >
                  {{ day.label }}
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label>Horaires de travail</label>
              <input 
                type="text" 
                v-model="barberForm.workHours" 
                placeholder="Ex: 9h00 - 18h00"
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label>Niveau d'expérience</label>
              <select v-model="barberForm.experience" class="form-control">
                <option value="junior">Junior</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="senior">Senior</option>
                <option value="master">Maître</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Notes</label>
              <textarea 
                v-model="barberForm.notes" 
                placeholder="Informations additionnelles"
                class="form-control"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn" @click="closeBarberModal">Annuler</button>
            <button 
              class="btn btn-primary" 
              @click="saveBarber"
              :disabled="!barberForm.name"
            >
              {{ editingBarberId ? 'Enregistrer les modifications' : 'Ajouter le coiffeur' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal">
        <div class="modal-content modal-sm">
          <div class="modal-header">
            <h2>Confirmer la suppression</h2>
            <button class="close-btn" @click="showDeleteModal = false">&times;</button>
          </div>
          
          <div class="modal-body">
            <p>Êtes-vous sûr de vouloir supprimer ce coiffeur ? Cette action est irréversible.</p>
            <p v-if="getBarberById(barberToDeleteId)?.clientsToday > 0" class="warning-text">
              <span class="icon">⚠️</span> Ce coiffeur a des clients aujourd'hui.
            </p>
          </div>
          
          <div class="modal-footer">
            <button class="btn" @click="showDeleteModal = false">Annuler</button>
            <button class="btn btn-danger" @click="deleteBarber">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BarbersView',
    data() {
      return {
        barbersList: [
          {
            id: 1,
            name: 'Antoine Dupont',
            photo: 'https://randomuser.me/api/portraits/men/32.jpg',
            specialties: ['Coupe homme', 'Barbe'],
            rating: 4.8,
            clientsToday: 8,
            averageTime: 25,
            isActive: true,
            workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            workHours: '9h00 - 18h00',
            experience: 'senior',
            notes: 'Spécialiste des coupes modernes et barbes stylisées.'
          },
          {
            id: 2,
            name: 'Sophie Martin',
            photo: 'https://randomuser.me/api/portraits/women/44.jpg',
            specialties: ['Coupe femme', 'Coloration'],
            rating: 4.9,
            clientsToday: 6,
            averageTime: 40,
            isActive: true,
            workDays: ['monday', 'wednesday', 'thursday', 'saturday'],
            workHours: '10h00 - 19h00',
            experience: 'master',
            notes: 'Plus de 10 ans d\'expérience en coloration et balayage.'
          },
          {
            id: 3,
            name: 'Lucas Bernard',
            photo: 'https://randomuser.me/api/portraits/men/22.jpg',
            specialties: ['Coupe homme', 'Barbe', 'Coupe + Barbe'],
            rating: 4.5,
            clientsToday: 7,
            averageTime: 30,
            isActive: false,
            workDays: ['tuesday', 'wednesday', 'friday', 'saturday'],
            workHours: '9h00 - 18h00',
            experience: 'intermediate',
            notes: ''
          },
          {
            id: 4,
            name: 'Julie Lambert',
            photo: 'https://randomuser.me/api/portraits/women/29.jpg',
            specialties: ['Coupe femme', 'Coloration', 'Coiffure événementielle'],
            rating: 4.7,
            clientsToday: 5,
            averageTime: 45,
            isActive: true,
            workDays: ['monday', 'thursday', 'friday', 'saturday'],
            workHours: '10h00 - 19h00',
            experience: 'senior',
            notes: 'Spécialisée dans les coiffures de mariage et événements.'
          }
        ],
        
        // Form data
        showAddBarberModal: false,
        editingBarberId: null,
        barberForm: {
          name: '',
          photo: '',
          specialties: [],
          workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          workHours: '9h00 - 18h00',
          experience: 'intermediate',
          notes: ''
        },
        
        // Photo upload
        imagePreview: null,
        imageFile: null,
        
        // Delete confirmation
        showDeleteModal: false,
        barberToDeleteId: null,
        
        // Available services
        availableServices: [
          'Coupe homme',
          'Coupe femme',
          'Barbe',
          'Coloration',
          'Coupe + Barbe',
          'Coiffure événementielle'
        ],
        
        // Days list
        days: [
          { label: 'L', value: 'monday' },
          { label: 'M', value: 'tuesday' },
          { label: 'M', value: 'wednesday' },
          { label: 'J', value: 'thursday' },
          { label: 'V', value: 'friday' },
          { label: 'S', value: 'saturday' },
          { label: 'D', value: 'sunday' }
        ]
      }
    },
    computed: {
      activeBarbers() {
        return this.barbersList.filter(barber => barber.isActive);
      },
      totalClientsToday() {
        return this.barbersList.reduce((total, barber) => total + barber.clientsToday, 0);
      },
      averageRating() {
        if (this.barbersList.length === 0) return 0;
        
        const totalRating = this.barbersList.reduce((sum, barber) => sum + barber.rating, 0);
        return (totalRating / this.barbersList.length).toFixed(1);
      }
    },
    methods: {
      getInitials(name) {
        return name
          .split(' ')
          .map(part => part.charAt(0))
          .join('')
          .toUpperCase();
      },
      
      toggleBarberStatus(barberId) {
        const barberIndex = this.barbersList.findIndex(b => b.id === barberId);
        if (barberIndex !== -1) {
          this.barbersList[barberIndex].isActive = !this.barbersList[barberIndex].isActive;
        }
      },
      
      editBarber(barberId) {
        const barber = this.getBarberById(barberId);
        if (barber) {
          this.editingBarberId = barberId;
          this.barberForm = { ...barber };
          
          // Initialiser l'aperçu de l'image si une photo existe
          if (barber.photo) {
            this.imagePreview = barber.photo;
          } else {
            this.imagePreview = null;
          }
        }
      },
      
      confirmDeleteBarber(barberId) {
        this.barberToDeleteId = barberId;
        this.showDeleteModal = true;
      },
      
      deleteBarber() {
        this.barbersList = this.barbersList.filter(b => b.id !== this.barberToDeleteId);
        this.showDeleteModal = false;
        this.barberToDeleteId = null;
      },
      
      getBarberById(id) {
        return this.barbersList.find(b => b.id === id);
      },
      
      closeBarberModal() {
        this.showAddBarberModal = false;
        this.editingBarberId = null;
        this.resetBarberForm();
      },
      
      resetBarberForm() {
        this.barberForm = {
          name: '',
          photo: '',
          specialties: [],
          workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          workHours: '9h00 - 18h00',
          experience: 'intermediate',
          notes: ''
        };
        this.imagePreview = null;
        this.imageFile = null;
      },
      
      handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Valider le type de fichier (uniquement images)
        if (!file.type.match('image.*')) {
          alert('Veuillez sélectionner une image');
          return;
        }
        
        // Limiter la taille (2MB max)
        if (file.size > 2 * 1024 * 1024) {
          alert('La taille de l\'image ne doit pas dépasser 2MB');
          return;
        }
        
        this.imageFile = file;
        
        // Créer un aperçu de l'image
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      
      removePhoto() {
        this.imagePreview = null;
        this.imageFile = null;
        this.barberForm.photo = '';
      },
      
      saveBarber() {
        if (!this.barberForm.name) return;
        
        // Si nous avons un nouveau fichier image, on "simule" l'upload et la récupération URL
        if (this.imageFile) {
          // Dans une application réelle, on uploaderait le fichier sur un serveur
          // et on récupèrerait l'URL du serveur
          // Ici nous utilisons simplement l'URL de l'aperçu comme "URL" de la photo
          this.barberForm.photo = this.imagePreview;
        }
        
        if (this.editingBarberId) {
          // Update existing barber
          const index = this.barbersList.findIndex(b => b.id === this.editingBarberId);
          if (index !== -1) {
            this.barbersList[index] = {
              ...this.barberForm,
              id: this.editingBarberId,
              // Keep these stats as they are
              rating: this.barbersList[index].rating,
              clientsToday: this.barbersList[index].clientsToday,
              averageTime: this.barbersList[index].averageTime,
              isActive: this.barbersList[index].isActive
            };
          }
        } else {
          // Add new barber
          const newId = Math.max(0, ...this.barbersList.map(b => b.id)) + 1;
          this.barbersList.push({
            ...this.barberForm,
            id: newId,
            rating: 5.0,
            clientsToday: 0,
            averageTime: 30,
            isActive: true
          });
        }
        
        this.closeBarberModal();
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .barbers-management {
    width: 100%;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h1 {
      margin: 0;
    }
    
    .btn {
      display: flex;
      align-items: center;
      gap: 5px;
      
      .icon {
        font-size: 1.2rem;
        font-weight: bold;
      }
    }
  }
  
  .barbers-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
    
    .stat-card {
      background-color: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      
      h3 {
        font-size: 0.9rem;
        color: #6c757d;
        margin-bottom: 10px;
        font-weight: 500;
      }
      
      .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2c3e50;
      }
    }
  }
  
  .barbers-container {
    margin-bottom: 30px;
  }
  
  .barbers-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .barber-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    .barber-header {
      position: relative;
      height: 100px;
      background-color: #4361ee;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .barber-status {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #dc3545;
        
        &.active {
          background-color: #28a745;
        }
      }
    }
    
    .barber-photo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid white;
      overflow: hidden;
      background-color: #fff;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      &.barber-placeholder {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #e9ecef;
        color: #6c757d;
        font-size: 1.5rem;
        font-weight: 600;
      }
    }
    
    .barber-info {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #e9ecef;
      
      .barber-name {
        margin: 0 0 5px 0;
        font-size: 1.2rem;
      }
      
      .barber-rating {
        margin-bottom: 10px;
        
        .star {
          color: #e0e0e0;
          font-size: 1rem;
          
          &.filled {
            color: #ffc107;
          }
        }
        
        .rating-value {
          font-size: 0.9rem;
          color: #6c757d;
          margin-left: 5px;
        }
      }
      
      .barber-specialties {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        
        .specialty-tag {
          background-color: #f8f9fa;
          color: #495057;
          font-size: 0.8rem;
          padding: 3px 8px;
          border-radius: 12px;
        }
      }
    }
    
    .barber-stats {
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      background-color: #f8f9fa;
      
      .barber-stat {
        .label {
          font-size: 0.8rem;
          color: #6c757d;
          display: block;
        }
        
        .value {
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }
    
    .barber-schedule {
      padding: 15px 20px;
      border-top: 1px solid #e9ecef;
      
      h4 {
        font-size: 0.9rem;
        margin: 0 0 10px 0;
        color: #6c757d;
      }
      
      .schedule-days {
        display: flex;
        gap: 4px;
        margin-bottom: 8px;
        
        .day-tag {
          width: 25px;
          height: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          background-color: #f8f9fa;
          color: #adb5bd;
          font-size: 0.8rem;
          
          &.active {
            background-color: #4361ee;
            color: white;
          }
        }
      }
      
      .schedule-hours {
        font-size: 0.9rem;
        color: #495057;
      }
    }
    
    .barber-actions {
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      background-color: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }
  }
  
  .empty-state {
    grid-column: 1 / -1;
    background-color: white;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 20px;
    }
    
    h3 {
      margin: 0 0 10px 0;
    }
    
    p {
      color: #6c757d;
      margin-bottom: 20px;
    }
  }
  
  // Modal styles
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    
    &.modal-sm {
      width: 400px;
    }
  }
  
  .modal-header {
    padding: 15px 20px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h2 {
      margin: 0;
      font-size: 1.4rem;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
  
  .modal-body {
    padding: 20px;
    
    .warning-text {
      color: #dc3545;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 15px;
    }
  }
  
  .modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .form-group {
    margin-bottom: 15px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      
      &:focus {
        outline: none;
        border-color: #4361ee;
        box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
      }
    }
    
    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .checkbox {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      padding: 4px 0;
      
      input {
        cursor: pointer;
      }
    }
  }
  
  // Photo upload styles
  .photo-upload {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-top: 10px;
    
    .preview-container {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #f0f0f0;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #ced4da;
    }
    
    .photo-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .photo-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2rem;
      color: #6c757d;
      background-color: #e9ecef;
    }
    
    .upload-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .hidden-input {
      display: none;
    }
    
    .upload-btn {
      cursor: pointer;
    }
    
    .btn-outline {
      background-color: transparent;
      border: 1px solid #4361ee;
      color: #4361ee;
      
      &:hover {
        background-color: rgba(67, 97, 238, 0.1);
      }
    }
  }
  
  // Responsive styles
  @media (max-width: 768px) {
    .barbers-stats {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .barbers-list {
    grid-template-columns: 1fr;
  }
  
  .photo-upload {
    flex-direction: column;
    align-items: center;
    
    .preview-container {
      margin-bottom: 10px;
    }
    
    .upload-actions {
      width: 100%;
      flex-direction: row;
      justify-content: center;
    }
  }
  
  .form-group {
    .checkbox-group {
      flex-direction: column;
    }
  }
}

@media (max-width: 480px) {
  .barbers-stats {
    grid-template-columns: 1fr;
  }
  
  .barber-stats, .barber-actions {
    flex-direction: column;
    gap: 10px;
    
    .barber-stat {
      display: flex;
      justify-content: space-between;
    }
  }
  
  .schedule-days {
    justify-content: space-between;
  }
  
  .modal-content {
    max-height: 95vh;
  }
}
</style>