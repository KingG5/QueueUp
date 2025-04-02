<template>
    <div class="home-view">
      <section class="hero-section">
        <div class="hero-content">
          <h1>No more waiting at the barbershop</h1>
          <p class="hero-subtitle">Join the queue online, get notified when it's your turn, and walk in just in time for your haircut.</p>
          
          <div class="cta-buttons">
            <router-link to="/register" class="btn btn-primary">Sign Up Free</router-link>
            <router-link to="/login" class="btn btn-outline">Login</router-link>
          </div>
        </div>
        
        <div class="hero-image">
          <img src="@/assets/hero-image.svg" alt="QueueUp System Illustration">
        </div>
      </section>
      
      <section class="features-section">
        <h2 class="section-title">How It Works</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Find a Barbershop</h3>
            <p>Discover barbershops near you and check their current wait times.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Join Remotely</h3>
            <p>Add yourself to the queue without being physically present at the shop.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔔</div>
            <h3>Get Notified</h3>
            <p>Receive alerts as your turn approaches, so you know exactly when to arrive.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⏱️</div>
            <h3>Save Time</h3>
            <p>No more lengthy waits in the shop - arrive just in time for your service.</p>
          </div>
        </div>
      </section>
      
      <section class="for-business-section">
        <div class="business-content">
          <h2>For Barbershop Owners</h2>
          <p>Streamline your operations, reduce congestion, and enhance your customers' experience.</p>
          
          <ul class="business-features">
            <li>
              <span class="check-icon">✓</span>
              <span>Manage your queue digitally</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Get insights into peak hours</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Improve customer satisfaction</span>
            </li>
            <li>
              <span class="check-icon">✓</span>
              <span>Reduce no-shows with notifications</span>
            </li>
          </ul>
          
          <router-link to="/register?type=business" class="btn btn-secondary">Register Your Business</router-link>
        </div>
        
        <div class="business-image">
          <img src="@/assets/business-dashboard.svg" alt="Business Dashboard">
        </div>
      </section>
      
      <section class="testimonials-section">
        <h2 class="section-title">What People Are Saying</h2>
        
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"I love that I can add myself to the queue from home and show up just in time for my haircut. No more waiting around!"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Thomas M.">
              </div>
              <div class="author-info">
                <div class="author-name">Thomas M.</div>
                <div class="author-title">Customer</div>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"As a barbershop owner, QueueUp has revolutionized our daily operations. Our shop is less crowded and customers are happier."</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sophie L.">
              </div>
              <div class="author-info">
                <div class="author-name">Sophie L.</div>
                <div class="author-title">Barbershop Owner</div>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"The real-time updates about my position in the queue are fantastic. I can run errands nearby until it's almost my turn."</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Alex P.">
              </div>
              <div class="author-info">
                <div class="author-name">Alex P.</div>
                <div class="author-title">Customer</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="cta-section">
        <h2>Ready to transform your barbershop experience?</h2>
        <p>Join thousands of others who have already made the switch to QueueUp.</p>
        <router-link to="/register" class="btn btn-large btn-primary">Get Started Now</router-link>
      </section>
      
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-logo">
            <span class="logo-icon">💇</span>
            <span class="logo-text">QueueUp</span>
          </div>
          
          <div class="footer-links">
            <div class="footer-column">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            
            <div class="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 QueueUp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomeView'
  }
  </script>
  
  <style scoped>
  .home-view {
    width: 100%;
  }
  
  /* Hero Section */
  .hero-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 60px 80px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .hero-content {
    width: 50%;
    padding-right: 40px;
  }
  
  .hero-content h1 {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #333;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 30px;
    line-height: 1.5;
  }
  
  .cta-buttons {
    display: flex;
    gap: 16px;
  }
  
  .hero-image {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .hero-image img {
    max-width: 100%;
    height: auto;
  }
  
  /* Features Section */
  .features-section {
    padding: 80px 40px;
    background-color: #f8f9fa;
    text-align: center;
  }
  
  .section-title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 40px;
    color: #333;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .feature-card {
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  
  .feature-card h3 {
    font-size: 1.3rem;
    margin-bottom: 15px;
    color: #333;
  }
  
  .feature-card p {
    color: #666;
    line-height: 1.5;
  }
  
  /* Business Section */
  .for-business-section {
    display: flex;
    align-items: center;
    padding: 80px 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .business-content {
    width: 50%;
    padding-right: 40px;
  }
  
  .business-content h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
  }
  
  .business-content p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 25px;
    line-height: 1.5;
  }
  
  .business-features {
    list-style: none;
    margin-bottom: 30px;
  }
  
  .business-features li {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-size: 1.1rem;
  }
  
  .check-icon {
    color: var(--secondary-color);
    font-weight: bold;
    margin-right: 12px;
    font-size: 1.2rem;
  }
  
  .business-image {
    width: 50%;
    display: flex;
    justify-content: center;
  }
  
  .business-image img {
    max-width: 100%;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  /* Testimonials Section */
  .testimonials-section {
    padding: 80px 40px;
    background-color: #f8f9fa;
    text-align: center;
  }
  
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .testimonial-card {
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    text-align: left;
  }
  
  .testimonial-content {
    margin-bottom: 20px;
  }
  
  .testimonial-content p {
    font-style: italic;
    color: #555;
    line-height: 1.6;
    font-size: 1.05rem;
  }
  
  .testimonial-author {
    display: flex;
    align-items: center;
  }
  
  .author-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;
  }
  
  .author-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .author-name {
    font-weight: 600;
    color: #333;
  }
  
  .author-title {
    font-size: 0.9rem;
    color: #666;
  }
  
  /* CTA Section */
  .cta-section {
    padding: 80px 40px;
    text-align: center;
    background-color: #edf2ff;
  }
  
  .cta-section h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
  }
  
  .cta-section p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 30px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }
  
  /* Footer */
  .footer {
    background-color: #2c3e50;
    color: white;
    padding: 60px 40px 30px;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    margin-bottom: 40px;
  }
  
  .footer-logo {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .logo-icon {
    margin-right: 10px;
    font-size: 1.8rem;
  }
  
  .footer-links {
    display: flex;
    gap: 60px;
  }
  
  .footer-column h4 {
    font-size: 1.1rem;
    margin-bottom: 20px;
    font-weight: 600;
  }
  
  .footer-column ul {
    list-style: none;
  }
  
  .footer-column li {
    margin-bottom: 10px;
  }
  
  .footer-column a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color 0.2s;
  }
  
  .footer-column a:hover {
    color: white;
  }
  
  .footer-bottom {
    text-align: center;
    padding-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  
  /* Button Styles */
  .btn {
    display: inline-block;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-primary {
    background-color: var(--primary-color);
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #0055d6;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 102, 255, 0.2);
  }
  
  .btn-secondary {
    background-color: var(--secondary-color);
    color: white;
    border: none;
  }
  
  .btn-secondary:hover {
    background-color: #2db84d;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(52, 199, 89, 0.2);
  }
  
  .btn-outline {
    background-color: transparent;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
  }
  
  .btn-outline:hover {
    background-color: rgba(0, 102, 255, 0.05);
    transform: translateY(-2px);
  }
  
  .btn-large {
    padding: 16px 32px;
    font-size: 1.1rem;
  }
  
  /* Responsive Styles */
  @media (max-width: 992px) {
    .hero-section, .for-business-section {
      flex-direction: column;
      padding: 60px 40px;
    }
    
    .hero-content, .business-content,
    .hero-image, .business-image {
      width: 100%;
      padding-right: 0;
    }
    
    .hero-image, .business-image {
      margin-top: 40px;
      order: 2;
    }
    
    .hero-content h1 {
      font-size: 2.4rem;
    }
    
    .business-content {
      order: 1;
    }
    
    .footer-content {
      flex-direction: column;
      gap: 40px;
    }
    
    .footer-links {
      flex-wrap: wrap;
      gap: 30px;
    }
  }
  
  @media (max-width: 768px) {
    .hero-section, .for-business-section {
      padding: 50px 20px;
    }
    
    .features-section, .testimonials-section, .cta-section {
      padding: 60px 20px;
    }
    
    .hero-content h1 {
      font-size: 2rem;
    }
    
    .testimonials-grid {
      grid-template-columns: 1fr;
    }
    
    .cta-buttons {
      flex-direction: column;
      width: 100%;
    }
    
    .btn {
      width: 100%;
    }
  }
  </style>