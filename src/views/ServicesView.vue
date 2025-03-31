Créons la page de gestion des services pour votre application QueueUp. Cette page permettra de gérer les différents services proposés par votre salon de coiffure.

Voici le code complet pour le composant ServicesView.vue :

```vue
<template>
  <div class="services-management">
    <div class="page-header">
      <h1>Gestion des Services</h1>
      <button class="btn btn-primary" @click="showAddServiceModal = true">
        <span class="icon">+</span> Ajouter un service
      </button>
    </div>
    
    <div class="services-stats">
      <div class="stat-card">
        <h3>Total Services</h3>
        <div class="stat-value">{{ servicesList.length }}</div>
      </div>
      <div class="stat-card">
        <h3>Prix Moyen</h3>
        <div class="stat-value">{{ averagePrice }}€</div>
      </div>
      <div class="stat-card">
        <h3>Durée Moyenne</h3>
        <div class="stat-value">{{ averageDuration }} min</div>
      </div>
      <div class="stat-card">
        <h3>Service le plus demandé</h3>
        <div class="stat-value">{{ mostPopularService }}</div>
      </div>
    </div>
    
    <div class="services-container">
      <div class="services-filters">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Rechercher un service..."
            class="form-control"
          >
        </div>
        <div class="filter-options">
          <select v-model="categoryFilter" class="form-control">
            <option value="">Toutes les catégories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <button 
            class="btn"
            :class="{ 'btn-active': sortOrder === 'name-asc' }"
            @click="setSortOrder('name-asc')"
          >
            Nom ↑
          </button>
          <button 
            class="btn"
            :class="{ 'btn-active': sortOrder === 'price-asc' }"
            @click="setSortOrder('price-asc')"
          >
            Prix ↑
          </button>
          <button 
            class="btn"
            :class="{ 'btn-active': sortOrder === 'duration-asc' }"
            @click="setSortOrder('duration-asc')"
          >
            Durée ↑
          </button>
        </div>
      </div>
      
      <div class="services-list">
        <div v-for="service in filteredServices" :key="service.id" class="service-card">
          <div class="service-header" :class="getCategoryClass(service.category)">
            <div class="service-icon">
              {{ getServiceIcon(service.category) }}
            </div>
            <div class="service-status" v-if="service.isPromoted">Promo</div>
          </div>
          
          <div class="service-content">
            <h3 class="service-name">{{ service.name }}</h3>
            <p class="service-description">{{ service.description }}</p>
            
            <div class="service-details">
              <div class="detail">
                <span class="label">Prix:</span>
                <span class="value">{{ formatPrice(service.price) }}</span>
              </div>
              <div class="detail">
                <span class="label">Durée:</span>
                <span class="value">{{ service.duration }} min</span>
              </div>
              <div class="detail">
                <span class="label">Catégorie:</span>
                <span class="value">{{ service.category }}</span>
              </div>
            </div>
            
            <div class="service-specialists" v-if="service.specialists && service.specialists.length > 0">
              <h4>Spécialistes:</h4>
              <div class="specialists-list">
                <span 
                  v-for="specialist in service.specialists" 
                  :key="specialist" 
                  class="specialist-tag"
                >
                  {{ specialist }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="service-actions">
            <button class="btn btn-sm btn-primary" @click="editService(service.id)">
              Modifier
            </button>
            <button 
              class="btn btn-sm" 
              :class="service.isPromoted ? 'btn-warning' : 'btn-success'"
              @click="togglePromotion(service.id)"
            >
              {{ service.isPromoted ? 'Retirer Promo' : 'Promouvoir' }}
            </button>
            <button class="btn btn-sm btn-danger" @click="confirmDeleteService(service.id)">
              Supprimer
            </button>
          </div>
        </div>
        
        <div v-if="filteredServices.length === 0" class="empty-state">
          <div v-if="searchQuery || categoryFilter" class="no-results">
            <div class="empty-icon">🔍</div>
            <h3>Aucun résultat</h3>
            <p>Aucun service ne correspond à votre recherche.</p>
            <button class="btn" @click="resetFilters">
              Réinitialiser les filtres
            </button>
          </div>
          <div v-else class="no-services">
            <div class="empty-icon">✂️</div>
            <h3>Aucun service</h3>
            <p>Ajoutez des services pour commencer.</p>
            <button class="btn btn-primary" @click="showAddServiceModal = true">
              Ajouter un service
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Service Modal -->
    <div v-if="showAddServiceModal || editingServiceId" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingServiceId ? 'Modifier le service' : 'Ajouter un service' }}</h2>
          <button class="close-btn" @click="closeServiceModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Nom du service</label>
            <input 
              type="text" 
              v-model="serviceForm.name" 
              placeholder="Nom du service"
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="serviceForm.description" 
              placeholder="Description du service"
              class="form-control"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label>Prix (€)</label>
              <input 
                type="number" 
                v-model="serviceForm.price" 
                placeholder="0.00"
                min="0"
                step="0.5"
                class="form-control"
              >
            </div>
            
            <div class="form-group half">
              <label>Durée (minutes)</label>
              <input 
                type="number" 
                v-model="serviceForm.duration" 
                placeholder="0"
                min="5"
                step="5"
                class="form-control"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label>Catégorie</label>
            <select v-model="serviceForm.category" class="form-control">
              <option value="">Sélectionner une catégorie</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Spécialistes</label>
            <div class="checkbox-group">
              <label class="checkbox" v-for="barber in availableBarbers" :key="barber">
                <input 
                  type="checkbox" 
                  :value="barber" 
                  v-model="serviceForm.specialists"
                >
                {{ barber }}
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <div class="checkbox">
              <input 
                type="checkbox" 
                id="isPromoted" 
                v-model="serviceForm.isPromoted"
              >
              <label for="isPromoted">Service en promotion</label>
            </div>
          </div>
          
          <div class="form-group" v-if="serviceForm.isPromoted">
            <label>Prix promotionnel (€)</label>
            <input 
              type="number" 
              v-model="serviceForm.promoPrice" 
              placeholder="0.00"
              min="0"
              step="0.5"
              class="form-control"
            >
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn" @click="closeServiceModal">Annuler</button>
          <button 
            class="btn btn-primary" 
            @click="saveService"
            :disabled="!serviceForm.name || !serviceForm.price || !serviceForm.duration || !serviceForm.category"
          >
            {{ editingServiceId ? 'Enregistrer les modifications' : 'Ajouter le service' }}
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
          <p>Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.</p>
          <p v-if="getServiceById(serviceToDeleteId)?.isPopular" class="warning-text">
            <span class="icon">⚠️</span> Ce service est très demandé.
          </p>
        </div>
        
        <div class="modal-footer">
          <button class="btn" @click="showDeleteModal = false">Annuler</button>
          <button class="btn btn-danger" @click="deleteService">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServicesView',
  data() {
    return {
      servicesList: [
        {
          id: 1,
          name: 'Coupe homme',
          description: 'Coupe et coiffage pour homme, adapté à tous types de cheveux.',
          price: 18,
          duration: 20,
          category: 'Homme',
          specialists: ['Antoine', 'Lucas'],
          isPromoted: false,
          isPopular: true,
          popularity: 85
        },
        {
          id: 2,
          name: 'Coupe femme',
          description: 'Coupe et coiffage pour femme, consultation sur le style incluse.',
          price: 28,
          duration: 40,
          category: 'Femme',
          specialists: ['Sophie', 'Julie'],
          isPromoted: true,
          promoPrice: 25,
          isPopular: true,
          popularity: 75
        },
        {
          id: 3,
          name: 'Taille de barbe',
          description: 'Taille et entretien de la barbe, avec serviette chaude et huiles essentielles.',
          price: 15,
          duration: 15,
          category: 'Homme',
          specialists: ['Antoine', 'Lucas'],
          isPromoted: false,
          isPopular: false,
          popularity: 45
        },
        {
          id: 4,
          name: 'Coloration complète',
          description: 'Coloration professionnelle avec des produits de qualité salon.',
          price: 55,
          duration: 60,
          category: 'Coloration',
          specialists: ['Sophie', 'Julie'],
          isPromoted: false,
          isPopular: false,
          popularity: 40
        },
        {
          id: 5,
          name: 'Balayage',
          description: 'Balayage naturel pour un effet de cheveux éclaircis par le soleil.',
          price: 70,
          duration: 90,
          category: 'Coloration',
          specialists: ['Sophie'],
          isPromoted: true,
          promoPrice: 60,
          isPopular: false,
          popularity: 50
        },
        {
          id: 6,
          name: 'Coupe enfant',
          description: 'Coupe adaptée aux enfants jusqu\'à 12 ans.',
          price: 12,
          duration: 15,
          category: 'Enfant',
          specialists: ['Antoine', 'Julie'],
          isPromoted: false,
          isPopular: false,
          popularity: 30
        },
        {
          id: 7,
          name: 'Coupe + barbe',
          description: 'Forfait incluant coupe homme et taille de barbe.',
          price: 30,
          duration: 35,
          category: 'Homme',
          specialists: ['Antoine', 'Lucas'],
          isPromoted: false,
          isPopular: true,
          popularity: 70
        },
        {
          id: 8,
          name: 'Coiffure événementielle',
          description: 'Coiffure élaborée pour mariages, soirées et événements spéciaux.',
          price: 65,
          duration: 60,
          category: 'Événement',
          specialists: ['Julie'],
          isPromoted: false,
          isPopular: false,
          popularity: 25
        }
      ],
      
      // Filters and sorting
      searchQuery: '',
      categoryFilter: '',
      sortOrder: 'name-asc',
      
      // Form data
      showAddServiceModal: false,
      editingServiceId: null,
      serviceForm: {
        name: '',
        description: '',
        price: null,
        duration: null,
        category: '',
        specialists: [],
        isPromoted: false,
        promoPrice: null,
        isPopular: false,
        popularity: 0
      },
      
      // Delete confirmation
      showDeleteModal: false,
      serviceToDeleteId: null,
      
      // Categories & barbers
      categories: ['Homme', 'Femme', 'Coloration', 'Enfant', 'Événement'],
      availableBarbers: ['Antoine', 'Sophie', 'Lucas', 'Julie']
    }
  },
  computed: {
    filteredServices() {
      let result = [...this.servicesList];
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(service => 
          service.name.toLowerCase().includes(query) || 
          service.description.toLowerCase().includes(query)
        );
      }
      
      // Apply category filter
      if (this.categoryFilter) {
        result = result.filter(service => service.category === this.categoryFilter);
      }
      
      // Apply sorting
      switch (this.sortOrder) {
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'duration-asc':
          result.sort((a, b) => a.duration - b.duration);
          break;
        default:
          break;
      }
      
      return result;
    },
    
    averagePrice() {
      if (this.servicesList.length === 0) return 0;
      
      const total = this.servicesList.reduce((sum, service) => sum + service.price, 0);
      return (total / this.servicesList.length).toFixed(2);
    },
    
    averageDuration() {
      if (this.servicesList.length === 0) return 0;
      
      const total = this.servicesList.reduce((sum, service) => sum + service.duration, 0);
      return Math.round(total / this.servicesList.length);
    },
    
    mostPopularService() {
      if (this.servicesList.length === 0) return 'Aucun';
      
      const mostPopular = this.servicesList.reduce((prev, current) => 
        (prev.popularity > current.popularity) ? prev : current
      );
      
      return mostPopular.name;
    }
  },
  methods: {
    formatPrice(price) {
      return `${price.toFixed(2)} €`;
    },
    
    getCategoryClass(category) {
      const classes = {
        'Homme': 'category-men',
        'Femme': 'category-women',
        'Coloration': 'category-color',
        'Enfant': 'category-child',
        'Événement': 'category-event'
      };
      
      return classes[category] || 'category-default';
    },
    
    getServiceIcon(category) {
      const icons = {
        'Homme': '👨',
        'Femme': '👩',
        'Coloration': '🎨',
        'Enfant': '👶',
        'Événement': '🎉'
      };
      
      return icons[category] || '✂️';
    },
    
    setSortOrder(order) {
      this.sortOrder = order;
    },
    
    resetFilters() {
      this.searchQuery = '';
      this.categoryFilter = '';
      this.sortOrder = 'name-asc';
    },
    
    togglePromotion(serviceId) {
      const serviceIndex = this.servicesList.findIndex(s => s.id === serviceId);
      if (serviceIndex !== -1) {
        const service = this.servicesList[serviceIndex];
        service.isPromoted = !service.isPromoted;
        
        // If promoting, set a default promo price
        if (service.isPromoted && !service.promoPrice) {
          service.promoPrice = Math.round(service.price * 0.9);
        }
      }
    },
    
    editService(serviceId) {
      const service = this.getServiceById(serviceId);
      if (service) {
        this.editingServiceId = serviceId;
        this.serviceForm = { ...service };
      }
    },
    
    confirmDeleteService(serviceId) {
      this.serviceToDeleteId = serviceId;
      this.showDeleteModal = true;
    },
    
    deleteService() {
      this.servicesList = this.servicesList.filter(s => s.id !== this.serviceToDeleteId);
      this.showDeleteModal = false;
      this.serviceToDeleteId = null;
    },
    
    getServiceById(id) {
      return this.servicesList.find(s => s.id === id);
    },
    
    closeServiceModal() {
      this.showAddServiceModal = false;
      this.editingServiceId = null;
      this.resetServiceForm();
    },
    
    resetServiceForm() {
      this.serviceForm = {
        name: '',
        description: '',
        price: null,
        duration: null,
        category: '',
        specialists: [],
        isPromoted: false,
        promoPrice: null,
        isPopular: false,
        popularity: 0
      };
    },
    
    saveService() {
      if (!this.serviceForm.name || !this.serviceForm.price || !this.serviceForm.duration || !this.serviceForm.category) {
        return;
      }
      
      if (this.editingServiceId) {
        // Update existing service
        const index = this.servicesList.findIndex(s => s.id === this.editingServiceId);
        if (index !== -1) {
          this.servicesList[index] = {
            ...this.serviceForm,
            id: this.editingServiceId,
            // Preserve popularity
            isPopular: this.servicesList[index].isPopular,
            popularity: this.servicesList[index].popularity
          };
        }
      } else {
        // Add new service
        const newId = Math.max(0, ...this.servicesList.map(s => s.id)) + 1;
        this.servicesList.push({
          ...this.serviceForm,
          id: newId,
          isPopular: false,
          popularity: 0
        });
      }
      
      this.closeServiceModal();
    }
  }
}
</script>

<style lang="scss" scoped>
.services-management {
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

.services-stats {
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

.services-container {
  margin-bottom: 30px;
}

.services-filters {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  
  .search-box {
    flex: 1;
    min-width: 220px;
  }
  
  .filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    
    select {
      width: auto;
      min-width: 180px;
    }
    
    .btn {
      background-color: white;
      border: 1px solid #ced4da;
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 0.9rem;
      
      &-active {
        background-color: #4361ee;
        color: white;
        border-color: #4361ee;
      }
    }
  }
}

.services-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.service-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  .service-header {
    height: 80px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &.category-men {
      background-color: #4361ee;
    }
    
    &.category-women {
      background-color: #f72585;
    }
    
    &.category-color {
      background-color: #7209b7;
    }
    
    &.category-child {
      background-color: #4cc9f0;
    }
    
    &.category-event {
      background-color: #fb8500;
    }
    
    &.category-default {
      background-color: #6c757d;
    }
    
    .service-icon {
      font-size: 2rem;
      color: white;
    }
    
    .service-status {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #ffc107;
      color: #212529;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
    }
  }
  
  .service-content {
    padding: 20px;
    flex: 1;
    
    .service-name {
      margin: 0 0 8px 0;
      font-size: 1.2rem;
    }
    
    .service-description {
      color: #6c757d;
      font-size: 0.9rem;
      margin-bottom: 15px;
    }
    
    .service-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 15px;
      
      .detail {
        display: flex;
        flex-direction: column;
        
        .label {
          font-size: 0.8rem;
          color: #6c757d;
        }
        
        .value {
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }
    
    .service-specialists {
      h4 {
        font-size: 0.9rem;
        margin: 0 0 8px 0;
        color: #6c757d;
      }
      
      .specialists-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .specialist-tag {
          background-color: #f8f9fa;
          color: #495057;
          font-size: 0.8rem;
          padding: 3px 8px;
          border-radius: 12px;
        }
      }
    }
  }
  
  .service-actions {
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
  
  &.half {
    width: calc(50% - 10px);
  }
  
  .checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    
    input {
      cursor: pointer;
    }
  }
  
  .checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    
    .checkbox {
      padding: 4px 0;
    }
  }
}

.form-row {
  display: flex;
  justify-content: space-between;
}

// Responsive styles
@media (max-width: 768px) {
  .services-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .services-list {
    grid-template-columns: 1fr;
  }
  
  .services-filters {
    .search-box {
      width: 100%;
    }
  }
  
  .service-content {
    .service-details {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .services-list {
      grid-template-columns: 1fr;
    }
    
    .services-filters {
      .search-box {
        width: 100%;
      }
    }
    
    .service-content {
      .service-details {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    .form-row {
      flex-direction: column;
      
      .form-group.half {
        width: 100%;
      }
    }
  }
  
  @media (max-width: 480px) {
    .services-stats {
      grid-template-columns: 1fr;
    }
    
    .service-actions {
      flex-direction: column;
      gap: 10px;
      
      .btn {
        width: 100%;
      }
    }
  }
}
</style>