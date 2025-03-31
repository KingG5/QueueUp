<template>
    <div class="settings-management">
      <div class="page-header">
        <h1>Paramètres du Salon</h1>
        <button class="btn btn-primary" @click="saveAllSettings">
          <span class="icon">💾</span> Enregistrer les modifications
        </button>
      </div>
      
      <div class="settings-container">
        <div class="settings-nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id" 
            class="tab-btn" 
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span class="icon">{{ tab.icon }}</span>
            <span>{{ tab.name }}</span>
          </button>
        </div>
        
        <div class="settings-content">
          <!-- Informations générales -->
          <div v-if="activeTab === 'general'" class="settings-panel">
            <h2>Informations générales</h2>
            <p class="panel-description">Configurez les informations de base de votre salon.</p>
            
            <div class="form-group">
              <label>Nom du salon</label>
              <input 
                type="text" 
                v-model="salonSettings.name" 
                placeholder="Nom de votre salon"
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label>Description</label>
              <textarea 
                v-model="salonSettings.description" 
                placeholder="Description de votre salon"
                class="form-control"
                rows="4"
              ></textarea>
              <div class="help-text">
                Cette description sera visible par les clients lors de la recherche d'établissements.
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group half">
                <label>Téléphone</label>
                <input 
                  type="tel" 
                  v-model="salonSettings.phone" 
                  placeholder="Numéro de téléphone"
                  class="form-control"
                >
              </div>
              
              <div class="form-group half">
                <label>Email</label>
                <input 
                  type="email" 
                  v-model="salonSettings.email" 
                  placeholder="Adresse email"
                  class="form-control"
                >
              </div>
            </div>
            
            <div class="form-group">
              <label>Site web</label>
              <input 
                type="url" 
                v-model="salonSettings.website" 
                placeholder="https://www.votresalon.com"
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label>Réseaux sociaux</label>
              <div class="social-links">
                <div class="social-link">
                  <span class="social-icon">📱</span>
                  <input 
                    type="text" 
                    v-model="salonSettings.socialMedia.instagram" 
                    placeholder="Instagram"
                    class="form-control"
                  >
                </div>
                <div class="social-link">
                  <span class="social-icon">👤</span>
                  <input 
                    type="text" 
                    v-model="salonSettings.socialMedia.facebook" 
                    placeholder="Facebook"
                    class="form-control"
                  >
                </div>
                <div class="social-link">
                  <span class="social-icon">🐦</span>
                  <input 
                    type="text" 
                    v-model="salonSettings.socialMedia.twitter" 
                    placeholder="Twitter"
                    class="form-control"
                  >
                </div>
              </div>
            </div>
          </div>
          
          <!-- Adresse et localisation -->
          <div v-if="activeTab === 'location'" class="settings-panel">
            <h2>Adresse et localisation</h2>
            <p class="panel-description">Définissez l'adresse de votre salon et sa position sur la carte.</p>
            
            <div class="form-group">
              <label>Adresse</label>
              <input 
                type="text" 
                v-model="salonSettings.address.street" 
                placeholder="Rue et numéro"
                class="form-control"
              >
            </div>
            
            <div class="form-row">
              <div class="form-group half">
                <label>Code postal</label>
                <input 
                  type="text" 
                  v-model="salonSettings.address.zipCode" 
                  placeholder="Code postal"
                  class="form-control"
                >
              </div>
              
              <div class="form-group half">
                <label>Ville</label>
                <input 
                  type="text" 
                  v-model="salonSettings.address.city" 
                  placeholder="Ville"
                  class="form-control"
                >
              </div>
            </div>
            
            <div class="form-group">
              <label>Pays</label>
              <select v-model="salonSettings.address.country" class="form-control">
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Canada">Canada</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Position sur la carte</label>
              <div class="map-container">
                <div class="map-placeholder">
                  <img src="https://maps.googleapis.com/maps/api/staticmap?center=Paris,France&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7CChamps-Elysees,Paris&key=YOUR_API_KEY" alt="Carte" class="map-image">
                  <div class="map-overlay">
                    <p>Carte de démonstration</p>
                    <p class="small">En production, intégrez Google Maps ou un service similaire</p>
                  </div>
                </div>
                <div class="map-controls">
                  <div class="form-row">
                    <div class="form-group half">
                      <label>Latitude</label>
                      <input 
                        type="text" 
                        v-model="salonSettings.location.lat" 
                        placeholder="Latitude"
                        class="form-control"
                      >
                    </div>
                    <div class="form-group half">
                      <label>Longitude</label>
                      <input 
                        type="text" 
                        v-model="salonSettings.location.lng" 
                        placeholder="Longitude"
                        class="form-control"
                      >
                    </div>
                  </div>
                  <div class="help-text">
                    Ces coordonnées permettront d'afficher précisément votre salon sur la carte.
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label>Consignes d'accès</label>
              <textarea 
                v-model="salonSettings.accessInstructions" 
                placeholder="Parking, transports en commun, accès handicapé..."
                class="form-control"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <!-- Horaires d'ouverture -->
          <div v-if="activeTab === 'hours'" class="settings-panel">
            <h2>Horaires d'ouverture</h2>
            <p class="panel-description">Configurez les horaires d'ouverture de votre salon.</p>
            
            <div class="hours-container">
              <div v-for="(day, index) in weekDays" :key="day.id" class="day-hours">
                <div class="day-name">
                  <label class="checkbox">
                    <input 
                      type="checkbox" 
                      v-model="salonSettings.openingHours[index].isOpen"
                    >
                    <span>{{ day.name }}</span>
                  </label>
                </div>
                
                <div class="hours-slots" v-if="salonSettings.openingHours[index].isOpen">
                  <div 
                    v-for="(slot, slotIndex) in salonSettings.openingHours[index].slots" 
                    :key="slotIndex"
                    class="time-slot"
                  >
                    <div class="time-inputs">
                      <input 
                        type="time" 
                        v-model="slot.from" 
                        class="form-control time-input"
                      >
                      <span class="separator">-</span>
                      <input 
                        type="time" 
                        v-model="slot.to" 
                        class="form-control time-input"
                      >
                    </div>
                    
                    <div class="slot-actions">
                      <button 
                        class="btn btn-sm btn-danger" 
                        @click="removeTimeSlot(index, slotIndex)"
                        v-if="salonSettings.openingHours[index].slots.length > 1"
                      >
                        <span class="icon">-</span>
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    class="btn btn-sm" 
                    @click="addTimeSlot(index)"
                  >
                    <span class="icon">+</span> Ajouter un créneau
                  </button>
                </div>
                
                <div class="closed-message" v-else>
                  Fermé
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label>Jours fériés et fermetures exceptionnelles</label>
              <div class="holidays-list">
                <div 
                  v-for="(holiday, index) in salonSettings.holidays" 
                  :key="index"
                  class="holiday-item"
                >
                  <div class="holiday-date">
                    <input 
                      type="date" 
                      v-model="holiday.date" 
                      class="form-control"
                    >
                  </div>
                  <div class="holiday-desc">
                    <input 
                      type="text" 
                      v-model="holiday.description" 
                      placeholder="Description"
                      class="form-control"
                    >
                  </div>
                  <div class="holiday-actions">
                    <button 
                      class="btn btn-sm btn-danger" 
                      @click="removeHoliday(index)"
                    >
                      <span class="icon">-</span>
                    </button>
                  </div>
                </div>
                
                <button 
                  class="btn btn-sm" 
                  @click="addHoliday"
                >
                  <span class="icon">+</span> Ajouter une date
                </button>
              </div>
            </div>
          </div>
          
          <!-- Photos -->
          <div v-if="activeTab === 'photos'" class="settings-panel">
            <h2>Photos du salon</h2>
            <p class="panel-description">Ajoutez des photos de votre salon qui seront visibles par les clients.</p>
            
            <div class="form-group">
              <label>Logo du salon</label>
              <div class="logo-upload">
                <div class="preview-container logo-preview">
                  <img v-if="salonSettings.logo" :src="salonSettings.logo" alt="Logo" class="logo-image">
                  <div v-else class="placeholder-logo">
                    <span>Logo</span>
                  </div>
                </div>
                <div class="upload-actions">
                  <label class="upload-btn">
                    <input type="file" accept="image/*" @change="handleLogoUpload" class="hidden-input">
                    <span class="btn btn-outline">Choisir un logo</span>
                  </label>
                  <button v-if="salonSettings.logo" class="btn btn-sm btn-danger" @click="removeLogo">
                    Supprimer
                  </button>
                </div>
              </div>
              <div class="help-text">
                Format recommandé : PNG ou JPG, 400x400 pixels minimum
              </div>
            </div>
            
            <div class="form-group">
              <label>Photos du salon</label>
              <p class="secondary-text">Ces photos seront affichées aux clients pour présenter votre établissement.</p>
              
              <div class="photos-gallery">
                <div 
                  v-for="(photo, index) in salonSettings.photos" 
                  :key="index"
                  class="gallery-item"
                >
                  <div class="gallery-image">
                    <img :src="photo.url" :alt="photo.caption" class="photo-image">
                    <div class="photo-actions">
                      <button class="btn btn-sm btn-danger" @click="removePhoto(index)">
                        <span class="icon">🗑️</span>
                      </button>
                      <button class="btn btn-sm btn-primary" @click="editPhotoCaption(index)">
                        <span class="icon">✏️</span>
                      </button>
                    </div>
                  </div>
                  <div class="gallery-caption">
                    {{ photo.caption || 'Sans titre' }}
                  </div>
                </div>
                
                <div class="gallery-upload">
                  <label class="upload-area">
                    <input type="file" accept="image/*" @change="handlePhotoUpload" class="hidden-input" multiple>
                    <div class="upload-placeholder">
                      <span class="icon">+</span>
                      <span>Ajouter des photos</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div class="help-text">
                Formats acceptés : JPG, PNG. Taille maximale : 5 MB par photo.
              </div>
            </div>
          </div>
          
          <!-- Personnalisation -->
          <div v-if="activeTab === 'appearance'" class="settings-panel">
            <h2>Personnalisation</h2>
            <p class="panel-description">Personnalisez l'apparence de votre salon sur la plateforme.</p>
            
            <div class="form-group">
              <label>Couleur principale</label>
              <div class="color-picker">
                <input type="color" v-model="salonSettings.appearance.primaryColor" class="color-input">
                <input 
                  type="text" 
                  v-model="salonSettings.appearance.primaryColor" 
                  class="form-control color-value"
                >
              </div>
            </div>
            
            <div class="form-group">
              <label>Couleur secondaire</label>
              <div class="color-picker">
                <input type="color" v-model="salonSettings.appearance.secondaryColor" class="color-input">
                <input 
                  type="text" 
                  v-model="salonSettings.appearance.secondaryColor" 
                  class="form-control color-value"
                >
              </div>
            </div>
            
            <div class="form-group">
              <label>Police de caractères</label>
              <select v-model="salonSettings.appearance.font" class="form-control">
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Open Sans, sans-serif">Open Sans</option>
                <option value="Montserrat, sans-serif">Montserrat</option>
                <option value="Raleway, sans-serif">Raleway</option>
                <option value="Poppins, sans-serif">Poppins</option>
              </select>
            </div>
            
            <div class="appearance-preview">
              <h3>Aperçu</h3>
              <div 
                class="preview-card"
                :style="{
                  fontFamily: salonSettings.appearance.font,
                  '--primary-color': salonSettings.appearance.primaryColor,
                  '--secondary-color': salonSettings.appearance.secondaryColor
                }"
              >
                <div class="preview-header" :style="{ backgroundColor: salonSettings.appearance.primaryColor }">
                  <div class="preview-logo">
                    <img v-if="salonSettings.logo" :src="salonSettings.logo" alt="Logo" class="preview-logo-img">
                    <div v-else class="preview-logo-placeholder">Logo</div>
                  </div>
                  <div class="preview-name">{{ salonSettings.name || 'Nom du salon' }}</div>
                </div>
                <div class="preview-content">
                  <div class="preview-section">
                    <div class="preview-section-title" :style="{ color: salonSettings.appearance.primaryColor }">
                      À propos
                    </div>
                    <div class="preview-text">
                      {{ salonSettings.description || 'Description du salon...' }}
                    </div>
                  </div>
                  <div class="preview-section">
                    <div class="preview-section-title" :style="{ color: salonSettings.appearance.primaryColor }">
                      Services
                    </div>
                    <div class="preview-service">
                      <div class="preview-service-name">Coupe homme</div>
                      <div class="preview-service-price">18€</div>
                    </div>
                    <div class="preview-service">
                      <div class="preview-service-name">Coupe femme</div>
                      <div class="preview-service-price">28€</div>
                    </div>
                  </div>
                  <button class="preview-button" :style="{ backgroundColor: salonSettings.appearance.secondaryColor }">
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Paramètres avancés -->
          <div v-if="activeTab === 'advanced'" class="settings-panel">
            <h2>Paramètres avancés</h2>
            <p class="panel-description">Configurez les paramètres avancés de votre salon.</p>
            
            <div class="form-group">
              <label>Options de réservation</label>
              <div class="checkbox">
                <input 
                  type="checkbox" 
                  id="allowOnlineBooking" 
                  v-model="salonSettings.bookingOptions.allowOnline"
                >
                <label for="allowOnlineBooking">Autoriser les réservations en ligne</label>
              </div>
              <div class="checkbox">
                <input 
                  type="checkbox" 
                  id="requireConfirmation" 
                  v-model="salonSettings.bookingOptions.requireConfirmation"
                >
                <label for="requireConfirmation">Exiger une confirmation manuelle pour chaque réservation</label>
              </div>
            </div>
            
            <div class="form-group">
              <label>Délai de réservation minimum (heures)</label>
              <input 
                type="number" 
                v-model="salonSettings.bookingOptions.minHoursBeforeBooking" 
                min="0" 
                step="1"
                class="form-control"
              >
              <div class="help-text">
                Le délai minimum requis avant qu'un client puisse prendre rendez-vous.
              </div>
            </div>
            
            <div class="form-group">
              <label>Durée par défaut des créneaux (minutes)</label>
              <input 
                type="number" 
                v-model="salonSettings.bookingOptions.defaultSlotDuration" 
                min="5" 
                step="5"
                class="form-control"
              >
            </div>
            
            <div class="form-group">
              <label>Notifications</label>
              <div class="checkbox">
                <input 
                  type="checkbox" 
                  id="emailNotifications" 
                  v-model="salonSettings.notifications.email"
                >
                <label for="emailNotifications">Recevoir des notifications par email</label>
              </div>
              <div class="checkbox">
                <input 
                  type="checkbox" 
                  id="smsNotifications" 
                  v-model="salonSettings.notifications.sms"
                >
                <label for="smsNotifications">Recevoir des notifications par SMS</label>
              </div>
              <div class="checkbox">
                <input 
                  type="checkbox" 
                  id="sendReminders" 
                  v-model="salonSettings.notifications.sendReminders"
                >
                <label for="sendReminders">Envoyer des rappels aux clients</label>
              </div>
            </div>
            
            <div class="form-group">
              <label>Délai de rappel avant rendez-vous (heures)</label>
              <input 
                type="number" 
                v-model="salonSettings.notifications.reminderHours" 
                min="1" 
                step="1"
                class="form-control"
                :disabled="!salonSettings.notifications.sendReminders"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SettingsView',
    data() {
      return {
        activeTab: 'general',
        
        tabs: [
          { id: 'general', name: 'Informations générales', icon: '📋' },
          { id: 'location', name: 'Adresse et localisation', icon: '📍' },
          { id: 'hours', name: 'Horaires d\'ouverture', icon: '🕒' },
          { id: 'photos', name: 'Photos', icon: '📷' },
          { id: 'appearance', name: 'Personnalisation', icon: '🎨' },
          { id: 'advanced', name: 'Paramètres avancés', icon: '⚙️' },
        ],
        
        weekDays: [
          { id: 'monday', name: 'Lundi' },
          { id: 'tuesday', name: 'Mardi' },
          { id: 'wednesday', name: 'Mercredi' },
          { id: 'thursday', name: 'Jeudi' },
          { id: 'friday', name: 'Vendredi' },
          { id: 'saturday', name: 'Samedi' },
          { id: 'sunday', name: 'Dimanche' }
        ],
        
        salonSettings: {
          name: 'Salon QueueUp',
          description: 'Salon de coiffure moderne proposant des services de qualité pour hommes et femmes dans une ambiance conviviale et détendue.',
          phone: '01 23 45 67 89',
          email: 'contact@queueup-salon.com',
          website: 'https://www.queueup-salon.com',
          
          socialMedia: {
            instagram: '@queueupsalon',
            facebook: 'QueueUpSalon',
            twitter: '@QueueUpSalon'
          },
          
          address: {
            street: '123 Avenue des Coiffeurs',
            zipCode: '75001',
            city: 'Paris',
            country: 'France'
          },
          
          location: {
            lat: '48.8566',
            lng: '2.3522'
          },
          
          accessInstructions: 'Parking à proximité. Métro ligne 1, station Champs-Élysées. Accès handicapé disponible.',
          
          openingHours: [
            { // Lundi
              isOpen: true,
              slots: [{ from: '09:00', to: '19:00' }]
            },
            { // Mardi
              isOpen: true,
              slots: [{ from: '09:00', to: '19:00' }]
            },
            { // Mercredi
              isOpen: true,
              slots: [{ from: '09:00', to: '19:00' }]
            },
            { // Jeudi
              isOpen: true,
              slots: [{ from: '09:00', to: '21:00' }]
            },
            { // Vendredi
              isOpen: true,
              slots: [{ from: '09:00', to: '21:00' }]
            },
            { // Samedi
              isOpen: true,
              slots: [{ from: '10:00', to: '18:00' }]
            },
            { // Dimanche
              isOpen: false,
              slots: [{ from: '10:00', to: '15:00' }]
            }
          ],
          
          holidays: [
            { date: '2023-12-25', description: 'Noël' },
            { date: '2024-01-01', description: 'Jour de l\'an' }
          ],
          
          logo: 'https://randomuser.me/api/portraits/lego/1.jpg',
          
          photos: [
            { 
              url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhhaXIlMjBzYWxvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', 
              caption: 'Espace d\'accueil' 
            },
            { 
              url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGFpciUyMHNhbG9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', 
              caption: 'Espace de coiffage' 
            },
            { 
              url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpcmRyZXNzZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', 
              caption: 'Notre équipe au travail' 
            },
          ],
          
          appearance: {
            primaryColor: '#4361ee',
            secondaryColor: '#f72585',
            font: 'Roboto, sans-serif'
          },
          
          bookingOptions: {
            allowOnline: true,
            requireConfirmation: false,
            minHoursBeforeBooking: 2,
            defaultSlotDuration: 30
          },
          
          notifications: {
            email: true,
            sms: true,
            sendReminders: true,
            reminderHours: 24
          }
        }
      }
    },
    methods: {
      saveAllSettings() {
        // Simuler l'enregistrement des paramètres
        console.log('Paramètres enregistrés', this.salonSettings);
        
        // Dans une application réelle, vous enverriez ces données à votre API
        alert('Les paramètres ont été enregistrés avec succès!');
      },
      
      addTimeSlot(dayIndex) {
        // Ajouter un nouveau créneau horaire
        this.salonSettings.openingHours[dayIndex].slots.push({ from: '09:00', to: '18:00' });
      },
      
      removeTimeSlot(dayIndex, slotIndex) {
        // Supprimer un créneau horaire
        this.salonSettings.openingHours[dayIndex].slots.splice(slotIndex, 1);
      },
      
      addHoliday() {
        // Ajouter un jour férié ou une fermeture exceptionnelle
        const currentDate = new Date().toISOString().split('T')[0];
        this.salonSettings.holidays.push({ date: currentDate, description: '' });
      },
      
      removeHoliday(index) {
        // Supprimer un jour férié
        this.salonSettings.holidays.splice(index, 1);
      },
      
      handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Valider le type de fichier
        if (!file.type.match('image.*')) {
          alert('Veuillez sélectionner une image');
          return;
        }
        
        // Simuler l'upload et récupérer l'URL
        const reader = new FileReader();
        reader.onload = (e) => {
          this.salonSettings.logo = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      
      removeLogo() {
        this.salonSettings.logo = null;
      },
      
      handlePhotoUpload(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        
        // Traiter chaque fichier
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          // Valider le type de fichier
          if (!file.type.match('image.*')) {
            continue;
          }
          
          // Simuler l'upload et récupérer l'URL
          const reader = new FileReader();
          reader.onload = (e) => {
            this.salonSettings.photos.push({
              url: e.target.result,
              caption: file.name.split('.')[0] // Utiliser le nom du fichier comme légende par défaut
            });
          };
          reader.readAsDataURL(file);
        }
      },
      
      removePhoto(index) {
        this.salonSettings.photos.splice(index, 1);
      },
      
      editPhotoCaption(index) {
        const photo = this.salonSettings.photos[index];
        const newCaption = prompt('Modifier la légende de la photo:', photo.caption);
        
        if (newCaption !== null) {
          photo.caption = newCaption;
        }
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .settings-management {
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
    }
  }
}

.settings-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.settings-nav {
  width: 250px;
  flex-shrink: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  .tab-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    border-bottom: 1px solid #e9ecef;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #f8f9fa;
    }
    
    &.active {
      background-color: #4361ee;
      color: white;
    }
    
    .icon {
      font-size: 1.2rem;
    }
  }
}

.settings-content {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
}

.settings-panel {
  padding: 20px;
  
  h2 {
    margin: 0 0 5px 0;
    font-size: 1.4rem;
    color: #2c3e50;
  }
  
  .panel-description {
    color: #6c757d;
    margin-bottom: 20px;
  }
}

.form-group {
  margin-bottom: 20px;
  
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
  
  .help-text {
    font-size: 0.85rem;
    color: #6c757d;
    margin-top: 5px;
  }
  
  .checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    
    input {
      cursor: pointer;
    }
  }
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .social-link {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .social-icon {
      font-size: 1.2rem;
      width: 30px;
      text-align: center;
    }
  }
}

.map-container {
  border: 1px solid #ced4da;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
  
  .map-placeholder {
    position: relative;
    width: 100%;
    height: 300px;
    background-color: #f8f9fa;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    
    .map-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .map-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      text-shadow: 0 1px 3px rgba(0,0,0,0.5);
      
      p {
        margin: 5px 0;
        
        &.small {
          font-size: 0.85rem;
          opacity: 0.8;
        }
      }
    }
  }
  
  .map-controls {
    padding: 15px;
    background-color: #f8f9fa;
    border-top: 1px solid #ced4da;
  }
}

.hours-container {
  border: 1px solid #ced4da;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}

.day-hours {
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
  
  .day-name {
    width: 150px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
  
  .hours-slots {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    .time-slot {
      display: flex;
      align-items: center;
      gap: 10px;
      
      .time-inputs {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .time-input {
          width: 120px;
        }
        
        .separator {
          font-weight: 500;
        }
      }
    }
  }
  
  .closed-message {
    flex: 1;
    color: #dc3545;
    font-style: italic;
    display: flex;
    align-items: center;
  }
}

.holidays-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .holiday-item {
    display: flex;
    gap: 10px;
    
    .holiday-date {
      width: 180px;
      flex-shrink: 0;
    }
    
    .holiday-desc {
      flex: 1;
    }
  }
}

.logo-upload {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 10px;
  
  .preview-container {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #ced4da;
    
    .logo-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .placeholder-logo {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f8f9fa;
      color: #6c757d;
    }
  }
  
  .upload-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

.photos-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 10px;
  
  .gallery-item {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #ced4da;
    
    .gallery-image {
      position: relative;
      height: 150px;
      overflow: hidden;
      
      .photo-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .photo-actions {
        position: absolute;
        top: 0;
        right: 0;
        padding: 8px;
        display: flex;
        gap: 5px;
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.2s;
      }
      
      &:hover .photo-actions {
        visibility: visible;
        opacity: 1;
      }
    }
    
    .gallery-caption {
      padding: 8px;
      font-size: 0.9rem;
      text-align: center;
      background-color: #f8f9fa;
      border-top: 1px solid #ced4da;
    }
  }
  
  .gallery-upload {
    border: 2px dashed #ced4da;
    border-radius: 8px;
    overflow: hidden;
    
    .upload-area {
      display: block;
      width: 100%;
      height: 100%;
      cursor: pointer;
      
      .upload-placeholder {
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #6c757d;
        gap: 10px;
        
        .icon {
          font-size: 2rem;
        }
      }
    }
  }
}

.hidden-input {
  display: none;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #4361ee;
  color: #4361ee;
  
  &:hover {
    background-color: rgba(67, 97, 238, 0.1);
  }
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .color-input {
    width: 50px;
    height: 50px;
    padding: 0;
    border: none;
    cursor: pointer;
  }
  
  .color-value {
    flex: 1;
  }
}

.appearance-preview {
  margin-top: 30px;
  
  h3 {
    margin: 0 0 15px 0;
    font-size: 1.1rem;
  }
  
  .preview-card {
    border: 1px solid #ced4da;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    max-width: 400px;
    
    .preview-header {
      padding: 15px;
      display: flex;
      align-items: center;
      gap: 15px;
      color: white;
      
      .preview-logo {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        
        .preview-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .preview-logo-placeholder {
          color: #6c757d;
          font-size: 0.8rem;
        }
      }
      
      .preview-name {
        font-weight: 600;
        font-size: 1.2rem;
      }
    }
    
    .preview-content {
      padding: 15px;
      
      .preview-section {
        margin-bottom: 15px;
        
        .preview-section-title {
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .preview-text {
          font-size: 0.9rem;
          color: #6c757d;
        }
        
        .preview-service {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #e9ecef;
          
          .preview-service-name {
            font-size: 0.9rem;
          }
          
          .preview-service-price {
            font-weight: 600;
          }
        }
      }
      
      .preview-button {
        width: 100%;
        padding: 8px;
        border: none;
        border-radius: 4px;
        color: white;
        font-weight: 600;
        cursor: pointer;
      }
    }
  }
}

.secondary-text {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0 0 15px 0;
}

@media (max-width: 992px) {
  .settings-container {
    flex-direction: column;
  }
  
  .settings-nav {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    
    .tab-btn {
      flex: 1;
      min-width: 120px;
      justify-content: center;
      border-bottom: none;
      border-right: 1px solid #e9ecef;
      padding: 10px;
      
      &:last-child {
        border-right: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 15px;
    
    .form-group.half {
      width: 100%;
    }
  }
  
  .day-hours {
    flex-direction: column;
    gap: 10px;
    
    .day-name {
      width: 100%;
    }
  }
  
  .photos-gallery {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 480px) {
  .settings-nav {
    .tab-btn {
      width: 50%;
      flex: none;
      
      &:nth-child(even) {
        border-right: none;
      }
    }
  }
  
  .holiday-item {
    flex-direction: column;
    
    .holiday-date, .holiday-desc {
      width: 100%;
    }
  }
}
</style>