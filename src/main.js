import './style.css'
import { cocktails, story, about, stockists, galleryImages } from './data.js'

const app = document.querySelector('#app');

const Header = () => `
  <header class="header">
    <div class="container header-content">
      <div class="logo">
        <a href="#"><img src="https://www.coppacocktails.com/logo.webp" alt="Coppa Cocktails"></a>
      </div>
      
      <nav class="nav-menu">
        <a href="#">HOME</a>
        <a href="#about">ABOUT US</a>
        <a href="#cocktails">OUR COCKTAILS</a>
        <a href="#story">COPPA VIBE</a>
        <a href="#find-us">STOCKISTS</a>
        <a href="#wholesale">WHOLESALE</a>
        <a href="#contact">CONTACT</a>
      </nav>
    </div>
  </header>
`;

const Footer = () => `
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-logo">
        <img src="https://www.coppacocktails.com/logo.webp" alt="Coppa Cocktails" loading="lazy">
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>Explore</h4>
          <a href="#cocktails">Our Cocktails</a>
          <a href="#about">About Us</a>
          <a href="#story">Coppa Vibe</a>
          <a href="#find-us">Find Us</a>
          <a href="#wholesale">Wholesale</a>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <a href="#terms">Terms & Conditions</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#cookies">Cookies</a>
        </div>
        <div class="footer-col">
          <h4>Follow Us</h4>
          <div class="social-links">
            <a href="https://wa.me/233540422494" target="_blank">WhatsApp +233 54 042 2494</a>
            <a href="https://instagram.com/coppacocktailsgh" target="_blank">Instagram @coppacocktailsgh</a>
            <a href="https://snapchat.com/add/coppacocktailsgh" target="_blank">Snapchat @coppacocktailsgh</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} Coppa Cocktails. Enjoy Responsibly.</p>
      </div>
    </div>
  </footer>
`;

const HomePage = () => `
  <section class="hero">
    <div class="hero-bg">
      <img src="https://www.coppacocktails.com/home/slide/slide1.jpg" alt="Cocktail Experience 1" class="hero-slide">
      <img src="https://www.coppacocktails.com/home/slide/slide3.jpg" alt="Cocktail Experience 2" class="hero-slide">
      <img src="https://www.coppacocktails.com/home/celebrateLife/celebrate-life2.jpg" alt="Cocktail Experience 3" class="hero-slide">
    </div>
    <div class="container hero-content-left">
      <h1 class="hero-title reveal">WORLD'S BEST<br>READY TO<br>DRINK<br>COCKTAILS</h1>
      <div class="hero-actions reveal" style="animation-delay: 0.4s">
        <a href="#cocktails" class="hero-btn">DISCOVER OUR COCKTAILS</a>
      </div>
    </div>
    <div class="slider-indicator reveal" style="animation-delay: 0.6s">
      <span class="active"></span>
      <span></span>
      <span></span>
    </div>
  </section>

  <section class="marquee-container">
    <div class="marquee-content">
      <span>ADD ICE & ENJOY 🍸 NO RULES. NO LIMITS. JUST ADD ICE & ENJOY 🍸 NO RULES. NO LIMITS. JUST ADD ICE & ENJOY 🍸 </span>
      <span>ADD ICE & ENJOY 🍸 NO RULES. NO LIMITS. JUST ADD ICE & ENJOY 🍸 NO RULES. NO LIMITS. JUST ADD ICE & ENJOY 🍸 </span>
    </div>
  </section>

  <section id="cocktails" class="section-padding cocktails-preview">
    <div class="container">
      <div class="section-header reveal">
        <span class="tag">PREMIUM SELECTION</span>
        <h2>Our Bestsellers</h2>
        <p>Expertly crafted, ready to serve. Discover the flavors that everyone is talking about.</p>
      </div>
      <div class="cocktail-grid">
        ${cocktails.map((cocktail, i) => `
          <div class="cocktail-card reveal" style="animation-delay: ${0.1 * (i + 1)}s">
            <div class="card-square" style="background-color: ${cocktail.color}">
              <div class="bestseller-badge">
                <span class="star">★</span> BESTSELLER
              </div>
              <img src="${cocktail.image}" alt="${cocktail.name}" loading="lazy">
              <div class="card-overlay">
                <a href="#cocktails" class="btn-view-flavor">View Details</a>
              </div>
            </div>
            <div class="card-info">
              <h3>${cocktail.name}</h3>
              <div class="card-meta">
                <span>${cocktail.taste}</span>
                <span class="dot">•</span>
                <span>${cocktail.spirit}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 60px;">
        <a href="#cocktails" class="btn btn-secondary">Explore Full Range</a>
      </div>
    </div>
  </section>

  <section class="instagram-section reveal">
    <div class="container">
      <div class="instagram-header">
        <div class="insta-info">
          <h3>Follow the Vibe</h3>
          <p>Tag us in your moments @coppacocktailsgh</p>
        </div>
        <a href="https://instagram.com/coppacocktailsgh" target="_blank" class="btn-insta">FOLLOW US</a>
      </div>
      <div class="insta-grid">
        ${galleryImages.slice(0, 6).map((img, i) => `
          <div class="insta-item">
            <img src="${img.src}" alt="Coppa Moment ${i+1}" loading="lazy">
          </div>
        `).join('')}
      </div>
    </div>
  </section>
`;

let currentFilter = 'All';
let currentGalleryFilter = 'All';

// StoryPage logic moved to enhanced version below


const CocktailsPage = () => {
  const filteredCocktails = currentFilter === 'All' 
    ? cocktails 
    : cocktails.filter(c => c.spirit.toLowerCase().includes(currentFilter.toLowerCase().replace('-based', '')));

  return `
  <section class="section-padding" style="background: var(--color-cream); margin-top: 130px;">
    <div class="container">
      <div class="section-header reveal">
        <h1>Our Cocktails</h1>
        <p>Explore our range of over 15 delicious ready-to-drink cocktails.</p>
      </div>
      
      <div class="filter-bar reveal">
        <button class="filter-btn ${currentFilter === 'All' ? 'active' : ''}" data-filter="All">All</button>
        <button class="filter-btn ${currentFilter === 'Rum-Based' ? 'active' : ''}" data-filter="Rum-Based">Rum-Based</button>
        <button class="filter-btn ${currentFilter === 'Tequila-Based' ? 'active' : ''}" data-filter="Tequila-Based">Tequila-Based</button>
        <button class="filter-btn ${currentFilter === 'Vodka-Based' ? 'active' : ''}" data-filter="Vodka-Based">Vodka-Based</button>
      </div>

      <div class="cocktail-grid">
        ${filteredCocktails.map((cocktail, i) => `
          <div class="cocktail-card reveal" style="animation-delay: ${0.05 * i}s">
            <div class="card-square" style="background-color: ${cocktail.color}">
              <div class="bestseller-badge">
                <span class="star">★</span> BESTSELLER
              </div>
              <img src="${cocktail.image}" alt="${cocktail.name}" loading="lazy">
            </div>
            <div class="card-info">
              <h3>${cocktail.name}</h3>
              <p>${cocktail.taste}</p>
              <p>${cocktail.spirit}</p>
              <p>${cocktail.format}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
`;
};

const ContactPage = () => `
  <section class="section-padding contact-section" style="margin-top: 130px;">
    <div class="container">
      <div class="contact-header reveal">
        <h1 class="font-heading">Get in Touch</h1>
        <p>Have a question or want to partner with us? Our team is here to help.</p>
      </div>
      
      <div class="contact-layout-new reveal">
        <div class="contact-image-wrapper">
          <img src="/viber/Margarita-Lifestyle-scaled.jpg" alt="Coppa Cocktails Contact" class="contact-image">
          <div class="contact-info-overlay">
            <div class="contact-method">
              <span class="method-label">EMAIL</span>
              <p class="method-value" style="color: white;">hello@coppacocktailsgh.com</p>
            </div>
            <div class="contact-method">
              <span class="method-label">FOLLOW US</span>
              <p class="method-value" style="color: white;">@coppacocktailsgh</p>
            </div>
          </div>
        </div>
        
        <div class="contact-form-container">
          <h2 class="font-heading" style="font-size: 32px; margin-bottom: 30px; color: var(--color-forest);">Send us a Message</h2>
          <form class="premium-form" id="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label>NAME</label>
                <input type="text" placeholder="Your full name" required>
              </div>
              <div class="form-group">
                <label>EMAIL</label>
                <input type="email" placeholder="Your email address" required>
              </div>
            </div>
            <div class="form-group">
              <label>MESSAGE</label>
              <textarea placeholder="How can we help you?" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn-submit-premium" style="width: 100%;">
              <span>SEND MESSAGE</span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
            </button>
          </form>
          
          <div class="whatsapp-alternative" style="margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 30px;">
            <p style="margin-bottom: 15px; color: #666; font-family: var(--font-heading); letter-spacing: 0.1em; font-size: 14px;">OR REACH US DIRECTLY ON WHATSAPP</p>
            <a href="https://wa.me/233540422494" target="_blank" class="whatsapp-btn-large" style="margin: 0 auto;">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const WholesalePage = () => `
  <section class="wholesale-hero">
    <div class="wholesale-hero-bg" style="background-image: url('https://www.coppacocktails.com/home/slide/slide3.jpg')"></div>
    <div class="wholesale-hero-content container">
      <h1 class="reveal">Partner With Us</h1>
      <p class="reveal" style="animation-delay: 0.2s">Bring the world's best cocktails to your venue.</p>
    </div>
  </section>

  <section class="section-padding" style="background: var(--color-white);">
    <div class="container">
      <div class="wholesale-grid-new">
        <div class="wholesale-info reveal">
          <span class="tag">B2B OPPORTUNITIES</span>
          <h2>Elevate Your Service</h2>
          <p>Whether you run a high-end lounge, a busy restaurant, or a retail chain, Coppa Cocktails provides a consistent, high-quality solution that saves time and maximizes profit.</p>
          <ul class="benefit-list">
            <li><span>✓</span> Award-winning premium quality</li>
            <li><span>✓</span> Significant reduction in waste</li>
            <li><span>✓</span> No specialized bar staff required</li>
            <li><span>✓</span> Fast, ready-to-serve solution</li>
          </ul>
        </div>
        <div class="wholesale-form-wrapper reveal" style="animation-delay: 0.2s">
          <form class="premium-form" id="wholesale-form">
            <div class="form-group">
              <label>BUSINESS NAME</label>
              <input type="text" placeholder="e.g. The Gold Lounge Accra" required>
            </div>
            <div class="form-group">
              <label>BUSINESS TYPE</label>
              <select required>
                <option value="" disabled selected>Select Business Type</option>
                <option value="bar">Bar / Lounge</option>
                <option value="restaurant">Restaurant</option>
                <option value="hotel">Hotel</option>
                <option value="retail">Retail Store</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>CONTACT PERSON</label>
                <input type="text" placeholder="Kofi Mensah" required>
              </div>
              <div class="form-group">
                <label>PHONE</label>
                <input type="tel" placeholder="+233 54 042 2494" required>
              </div>
            </div>
            <div class="form-group">
              <label>EMAIL</label>
              <input type="email" placeholder="kofi@venue.com" required>
            </div>
            <div class="form-group">
              <label>MESSAGE</label>
              <textarea placeholder="Tell us about your business needs..." rows="4" required></textarea>
            </div>
            <button type="submit" class="btn-submit-premium">
              <span>SUBMIT ENQUIRY</span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
`;

const LegalPage = (title) => `
  <section class="section-padding" style="background: var(--color-white); margin-top: 130px;">
    <div class="container">
      <div class="reveal">
        <h1>${title}</h1>
        <div style="margin-top: 40px; line-height: 2;">
          <p>This is the ${title} page for Coppa Cocktails Ghana. Content coming soon.</p>
        </div>
      </div>
    </div>
  </section>
`;

const AboutPage = () => `
  <section class="about-hero">
    <div class="about-hero-bg" style="background-image: url('https://www.coppacocktails.com/home/slide/slide1.jpg')"></div>
    <div class="about-hero-content container">
      <h1 class="reveal">${about.title}</h1>
      <p class="reveal" style="animation-delay: 0.2s">The world's best ready-to-serve cocktails.</p>
    </div>
  </section>

  <section class="section-padding" style="background: var(--color-white);">
    <div class="container">
      <div class="about-grid">
        ${about.content.map((section, i) => `
          <div class="about-row ${i % 2 === 1 ? 'row-reverse' : ''} reveal" style="animation-delay: ${0.2 * i}s">
            <div class="about-col-text">
              <span class="row-num">0${i + 1}</span>
              <h2>${section.heading}</h2>
              <div class="text-block">
                <p>${section.text}</p>
              </div>
            </div>
            <div class="about-col-img">
              <div class="img-wrapper">
                <img src="${about.images[i] || about.images[0]}" alt="${section.heading}" loading="lazy">
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section class="about-quote section-padding">
    <div class="container">
      <div class="quote-content reveal">
        <svg class="quote-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H11.017V21H14.017ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H7.017C6.46472 8 6.017 8.44772 6.017 9V12C6.017 12.5523 5.56928 13 5.017 13H2.017V21H5.017Z"/></svg>
        <p>Just add ice, pour, and enjoy. The perfect cocktail experience in every bottle.</p>
        <span class="author">— Coppa Cocktails Team</span>
      </div>
    </div>
  </section>
`;


const StoryPage = () => {
  const categories = ['All', 'Lifestyle', 'Moments', 'Products', 'Travel'];
  const filteredGallery = currentGalleryFilter === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === currentGalleryFilter);

  return `
  <section class="gallery-page" style="margin-top: 130px; background: #0a0a0a; min-height: 100vh; padding-bottom: 120px;">
    <div class="gallery-hero reveal">
      <div class="gallery-hero-overlay"></div>
      <img src="https://www.coppacocktails.com/home/celebrateLife/celebrate-life3.jpg" alt="Coppa Vibe" class="gallery-hero-bg">
      <div class="gallery-hero-content">
        <span class="gallery-tag">THE COPPA VIBE</span>
        <h1 class="gallery-hero-title">Life's Better<br>With Coppa</h1>
        <p class="gallery-hero-sub">No rules. No limits. Just add ice &amp; enjoy.</p>
      </div>
    </div>

    <div class="container" style="position: relative; z-index: 2; padding-top: 80px;">
      <div class="gallery-filter-bar reveal">
        ${categories.map(cat => `
          <button class="gallery-filter-btn ${currentGalleryFilter === cat ? 'active' : ''}" data-gallery-filter="${cat}">
            ${cat}
          </button>
        `).join('')}
      </div>

      <div class="gallery-intro reveal">
        <div class="intro-left">
          <h2>MOMENTS<br>TO REMEMBER</h2>
        </div>
        <div class="intro-right">
          <p>Every pour of Coppa is an invitation to celebrate. From intimate gatherings to legendary parties, explore the vibe that defines the world's best ready-to-serve cocktails.</p>
        </div>
      </div>

      <div class="gallery-section-header reveal">
        <div class="gallery-line"></div>
        <span class="gallery-label">THE COLLECTION</span>
        <div class="gallery-line"></div>
      </div>

      <div class="gallery-masonry">
        ${filteredGallery.map((item, i) => {
          // A more varied masonry pattern
          const patterns = ['normal', 'tall', 'normal', 'wide', 'normal', 'big', 'normal', 'tall', 'wide'];
          const spanClass = patterns[i % patterns.length];
          
          return `
            <div class="gallery-item gallery-item--${spanClass} reveal" data-index="${i}" data-parallax="0.1">
              <div class="gallery-item-inner">
                <img src="${item.src}" alt="${item.label}" loading="lazy" class="parallax-img">
                <div class="gallery-item-overlay">
                  <div class="overlay-content">
                    <span class="gallery-item-category">${item.category || 'MOMENT'}</span>
                    <span class="gallery-item-label">${item.label}</span>
                    <div class="view-btn">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Lightbox -->
    <div class="gallery-lightbox" id="gallery-lightbox">
      <div class="lightbox-backdrop"></div>
      <button class="lightbox-close" id="lightbox-close" aria-label="Close">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <button class="lightbox-prev" id="lightbox-prev" aria-label="Previous">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button class="lightbox-next" id="lightbox-next" aria-label="Next">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <div class="lightbox-inner">
        <div class="lightbox-media">
          <img src="" alt="" id="lightbox-img">
        </div>
        <div class="lightbox-info">
          <div class="info-content">
            <span class="lightbox-label" id="lightbox-label"></span>
            <span class="lightbox-counter" id="lightbox-counter"></span>
          </div>
        </div>
      </div>
    </div>
  </section>
`;
};

const FindUsPage = () => `
  <section class="find-us-hero">
    <div class="container">
      <div class="hero-text reveal">
        <h1>Where to<br>Find Us</h1>
        <p>Available at premium bars, lounges, and selected retail stores across Ghana.</p>
      </div>
    </div>
  </section>

  <section class="section-padding" style="background: var(--color-white);">
    <div class="container">
      <div class="stockist-grid">
        ${stockists.map((area, i) => `
          <div class="area-section reveal" style="animation-delay: ${0.2 * i}s">
            <div class="area-header">
              <span class="area-tag">AREA</span>
              <h2>${area.area}</h2>
            </div>
            <div class="location-list">
              ${area.locations.map(loc => `
                <div class="location-item">
                  <div class="loc-info">
                    <h3>${loc.name}</h3>
                    <p>${loc.address}</p>
                  </div>
                  <a href="https://maps.google.com/?q=${encodeURIComponent(loc.name + ' ' + loc.address)}" target="_blank" class="loc-map-btn">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </a>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <section class="map-section reveal">
    <div class="container">
      <div class="map-container">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127066.25301887313!2d-0.1869644!3d5.6037168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra!5e0!3m2!1sen!2sgh!4v1713539400000!5m2!1sen!2sgh" 
          width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy">
        </iframe>
      </div>
    </div>
  </section>
`;

const router = () => {
  const hash = window.location.hash || '#';
  let content = '';

  if (hash === '#') {
    content = HomePage();
  } else if (hash === '#cocktails') {
    content = CocktailsPage();
  } else if (hash === '#story') {
    content = StoryPage();
  } else if (hash === '#about') {
    content = AboutPage();
  } else if (hash === '#wholesale') {
    content = WholesalePage();
  } else if (hash === '#contact') {
    content = ContactPage();
  } else if (hash === '#find-us') {
    content = FindUsPage();
  } else if (hash === '#terms') {
    content = LegalPage('Terms & Conditions');
  } else if (hash === '#privacy') {
    content = LegalPage('Privacy Policy');
  } else if (hash === '#cookies') {
    content = LegalPage('Cookies Policy');
  } else {
    content = `<h1>Page Not Found</h1><a href="#">Back to Home</a>`;
  }

  app.innerHTML = `
    ${Header()}
    <main>${content}</main>
    ${Footer()}
    <a href="https://wa.me/233540422494" target="_blank" class="whatsapp-float" aria-label="Chat on WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="35" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
    </a>
  `;

  initInteractions();
};

const initInteractions = () => {
  // Intersection Observer for reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: stop observing once revealed
        // revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Parallax Effect
  const parallaxItems = document.querySelectorAll('.gallery-item');
  const handleParallax = () => {
    const scrollY = window.scrollY;
    parallaxItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const speed = parseFloat(item.dataset.parallax) || 0.1;
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const img = item.querySelector('.parallax-img');
        if (img) {
          const yPos = (rect.top - window.innerHeight / 2) * speed;
          img.style.transform = `scale(1.1) translateY(${yPos}px)`;
        }
      }
    });
  };

  if (parallaxItems.length > 0) {
    if (window.handleParallax) window.removeEventListener('scroll', window.handleParallax);
    window.handleParallax = handleParallax;
    window.addEventListener('scroll', window.handleParallax, { passive: true });
    window.handleParallax(); // Initial call
  }

  // Handle Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentFilter = e.target.dataset.filter;
      router();
    });
  });

  // Gallery lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxLabel = document.getElementById('lightbox-label');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentLightboxIndex = 0;

  // Gallery Filtering
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentGalleryFilter = btn.dataset.galleryFilter;
      router();
    });
  });

  // Custom Cursor with Smoothing
  const cursor = document.getElementById('custom-cursor');
  if (cursor) {
    if (window.handleMousemove) document.removeEventListener('mousemove', window.handleMousemove);
    if (window.cursorAnimId) cancelAnimationFrame(window.cursorAnimId);

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2;

    window.handleMousemove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener('mousemove', window.handleMousemove);

    const animateCursor = () => {
      const lerp = (a, b, n) => (1 - n) * a + n * b;
      cursorX = lerp(cursorX, mouseX, 0.15);
      cursorY = lerp(cursorY, mouseY, 0.15);
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      window.cursorAnimId = requestAnimationFrame(animateCursor);
    };
    animateCursor();

    galleryItems.forEach(item => {
      item.addEventListener('mouseenter', () => cursor.classList.add('active'));
      item.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  if (lightbox && galleryItems.length) {
    const activeGallery = currentGalleryFilter === 'All' 
      ? galleryImages 
      : galleryImages.filter(img => img.category === currentGalleryFilter);

    const openLightbox = (index) => {
      currentLightboxIndex = index;
      const item = activeGallery[index];
      const mediaContainer = lightbox.querySelector('.lightbox-media');
      
      lightboxImg.style.opacity = '0';
      
      setTimeout(() => {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.label;
        lightboxImg.style.display = 'block';
        lightboxImg.style.opacity = '1';
        
        lightboxLabel.textContent = item.label;
        lightboxCounter.textContent = `${index + 1} / ${activeGallery.length}`;
      }, 200);

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
      
    const preloadImage = (index) => {
      const img = new Image();
      img.src = activeGallery[index].src;
    };

    const navigateLightbox = (dir) => {
      const newIndex = (currentLightboxIndex + dir + activeGallery.length) % activeGallery.length;
      openLightbox(newIndex);
      
      // Preload next/prev
      const nextIndex = (newIndex + 1) % activeGallery.length;
      const prevIndex = (newIndex - 1 + activeGallery.length) % activeGallery.length;
      preloadImage(nextIndex);
      preloadImage(prevIndex);
    };

    // Mobile Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      if (touchEndX < touchStartX - 50) navigateLightbox(1);
      if (touchEndX > touchStartX + 50) navigateLightbox(-1);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { 
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });



    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });

    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });

    const handleKeydown = (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };

    if (window.handleKeydown) document.removeEventListener('keydown', window.handleKeydown);
    window.handleKeydown = handleKeydown;
    document.addEventListener('keydown', window.handleKeydown);
  }

  // Handle Forms
  const forms = document.querySelectorAll('.premium-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span>SENDING...</span>';
      btn.style.opacity = '0.7';
      btn.disabled = true;
      
      setTimeout(() => {
        alert('Thank you! Your message has been sent.');
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        btn.disabled = false;
        form.reset();
      }, 1500);
    });
  });

  window.scrollTo(0, 0);
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
router();
