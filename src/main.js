import './style.css'
import { cocktails, cocktailDetails, story, about, stockists, galleryImages, coppaBox } from './data.js'

const app = document.querySelector('#app');

// ----- The Coppa Box (mixed box sold as one item) -----
const BOX_MAX_QUANTITY = 50;
const formatCedis = (amount) => `GH₵${amount.toLocaleString('en-US')}`;
const boxCocktails = () => coppaBox.cocktailIds.map(id => cocktails.find(c => c.id === id)).filter(Boolean);
const clampBoxQuantity = (value) => Math.min(BOX_MAX_QUANTITY, Math.max(1, Math.floor(Number(value)) || 1));

// The box's bottles fanned out (middle bottle in front). stacked = two rows (4 behind, 3 in front) for square frames
const BoxBottles = ({ stacked = false } = {}) => {
  const bottles = boxCocktails();
  const fan = (row, delayStart = 0) => {
    const middle = (row.length - 1) / 2;
    return row.map((c, i) => {
      const offset = i - middle;
      return `<img src="${c.image}" alt="" style="--tilt: ${offset * (stacked ? 4 : 5)}deg; --drop: ${Math.abs(offset) * (stacked ? 3 : 5)}%; --delay: ${(delayStart + i) * 0.08}s; z-index: ${10 - Math.ceil(Math.abs(offset))}">`;
    }).join('');
  };
  if (!stacked) return `<div class="box-bottles" aria-hidden="true">${fan(bottles)}</div>`;
  const back = bottles.slice(0, Math.ceil(bottles.length / 2) + (bottles.length % 2 ? 0 : 1));
  const front = bottles.slice(back.length);
  return `
    <div class="box-bottles box-bottles--stacked" aria-hidden="true">
      <div class="box-row box-row--back">${fan(back)}</div>
      <div class="box-row box-row--front">${fan(front, back.length)}</div>
    </div>
  `;
};

// Home page promo for the box: price shown above the order button
const BoxPromo = () => `
  <section class="box-promo">
    <div class="container box-promo-inner">
      <div class="box-promo-copy reveal">
        <span class="tag">Order online</span>
        <h2>${coppaBox.name}</h2>
        <p>Seven Coppa cocktails in one box: ${boxCocktails().map(c => titleCase(c.name)).join(', ')}.</p>
        <p class="box-price"><span>Box price</span>${formatCedis(coppaBox.price)}</p>
        <a href="#box" class="product-btn product-btn--primary">Order the box</a>
      </div>
      <a href="#box" class="box-visual box-promo-visual" aria-label="Order ${coppaBox.name}">
        ${BoxBottles()}
      </a>
    </div>
  </section>
`;

const BoxPage = () => {
  const bottles = boxCocktails();
  return `
  <section class="product-page box-page">
    <div class="container">
      <nav class="product-breadcrumb" aria-label="Breadcrumb">
        <a href="#cocktails">Our Cocktails</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">${coppaBox.name}</span>
      </nav>

      <div class="product-hero">
        <div class="box-visual box-page-visual">
          ${BoxBottles({ stacked: true })}
        </div>

        <div class="product-summary">
          <p class="product-tags">Mixed box <span aria-hidden="true">•</span> ${bottles.length} cocktails</p>
          <h1>${coppaBox.name}</h1>
          <p class="box-price box-price--large"><span>Price per box</span>${formatCedis(coppaBox.price)}</p>
          <p class="box-lead">Seven of our cocktails in one box. Chill, add ice and pour.</p>

          <h2 class="box-subheading">What's in the box</h2>
          <ul class="box-contents">
            ${bottles.map(c => `
              <li>
                <a href="#cocktail/${c.id}" style="--item-color: ${c.color}">
                  <img src="${c.image}" alt="" loading="lazy">
                  <span><strong>${titleCase(c.name)}</strong>${c.taste}</span>
                </a>
              </li>
            `).join('')}
          </ul>

          <form class="premium-form box-order-form" id="box-order-form">
            <h2 class="box-subheading">Place your order</h2>

            <div class="form-group">
              <label for="box-quantity">NUMBER OF BOXES</label>
              <div class="qty-stepper">
                <button type="button" data-qty-step="-1" aria-label="One box fewer">−</button>
                <input type="number" id="box-quantity" name="quantity" value="1" min="1" max="${BOX_MAX_QUANTITY}" inputmode="numeric" required>
                <button type="button" data-qty-step="1" aria-label="One box more">+</button>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="box-name">NAME</label>
                <input type="text" id="box-name" name="name" placeholder="Your full name" autocomplete="name" required>
              </div>
              <div class="form-group">
                <label for="box-phone">PHONE</label>
                <input type="tel" id="box-phone" name="phone" placeholder="Your phone number" autocomplete="tel" pattern="\\+?[0-9 ]{9,18}" title="Digits only, e.g. 024 000 0000 or +233 24 000 0000" required>
              </div>
            </div>

            <fieldset class="box-fulfilment">
              <legend>DELIVERY OR PICK-UP</legend>
              <label><input type="radio" name="fulfilment" value="delivery" checked> Deliver to me</label>
              <label><input type="radio" name="fulfilment" value="pickup"> I'll pick it up</label>
            </fieldset>

            <div class="form-group" data-address-group>
              <label for="box-address">DELIVERY ADDRESS / AREA</label>
              <textarea id="box-address" name="address" rows="2" placeholder="e.g. East Legon, near the A&amp;C Mall" autocomplete="street-address" required></textarea>
            </div>

            <div class="form-group">
              <label for="box-note">NOTE (OPTIONAL)</label>
              <textarea id="box-note" name="note" rows="2" placeholder="Preferred delivery time, gift message…"></textarea>
            </div>

            <label class="box-age-check">
              <input type="checkbox" name="age" required>
              <span>I confirm I am 18 or older.</span>
            </label>

            <div class="box-total" aria-live="polite">
              <span>Total</span>
              <strong data-box-total>${formatCedis(coppaBox.price)}</strong>
            </div>

            <button type="submit" class="btn-submit-premium">
              <span>PLACE ORDER VIA WHATSAPP</span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
            </button>
          </form>
          <p class="product-note">Your order opens in WhatsApp so we can confirm it, the delivery fee and payment with you. For adults 18+ only. Please enjoy responsibly.</p>
        </div>
      </div>
    </div>
  </section>
`;
};

// Which top-level nav item the current page belongs to (for aria-current / active styling)
const navSection = () => {
  const route = (window.location.hash || '#').split('?')[0] || '#';
  return route.startsWith('#cocktail/') ? '#cocktails' : route;
};

const Header = () => {
  const section = navSection();
  const current = (href) => (href === section ? 'aria-current="page"' : '');
  return `
  <header class="header">
    <div class="container header-content">
      <div class="logo">
        <a href="#" aria-label="Coppa Cocktails home"><img src="/images/logo.webp" alt="Coppa Cocktails"></a>
      </div>

      <!-- Phones & tablets: Order button + menu toggle (the nav below becomes a full-screen menu) -->
      <div class="header-actions">
        <a href="#box" class="header-order" ${current('#box')}>Order</a>
        <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
          <span class="menu-toggle-bars" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>
      </div>

      <nav class="nav-menu" id="site-nav" aria-label="Main">
        <a href="#" ${current('#')}>HOME</a>
        <a href="#about" ${current('#about')}>ABOUT US</a>
        <div class="nav-dropdown">
          <a href="#cocktails" class="nav-dropdown-trigger" ${current('#cocktails')} aria-haspopup="true" aria-expanded="false" aria-controls="mega-menu">OUR COCKTAILS</a>
          ${MegaMenu()}
        </div>
        <a href="#story" ${current('#story')}>COPPA VIBE</a>
        <a href="#find-us" ${current('#find-us')}>STOCKISTS</a>
        <a href="#wholesale" ${current('#wholesale')}>WHOLESALE</a>
        <a href="#contact" ${current('#contact')}>CONTACT</a>
        <a href="#box" class="nav-order" ${current('#box')}>ORDER</a>

        <div class="nav-panel-footer">
          <a href="#box" class="nav-panel-cta">
            <span>Order ${coppaBox.name}</span>
            <strong>${formatCedis(coppaBox.price)}</strong>
          </a>
          <div class="nav-panel-contact">
            <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer">WhatsApp +233 54 042 2494</a>
            <a href="https://instagram.com/coppacocktailsgh" target="_blank" rel="noopener noreferrer">Instagram @coppacocktailsgh</a>
          </div>
          <p>For adults 18+ only. Please enjoy responsibly.</p>
        </div>
      </nav>
    </div>
  </header>
`;
};

const Footer = () => `
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-logo">
        <img src="/images/logo.webp" alt="Coppa Cocktails" loading="lazy">
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <h4>Explore</h4>
          <a href="#cocktails">Our Cocktails</a>
          <a href="#box">Order ${coppaBox.name}</a>
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
            <a href="https://wa.me/233540422494" target="_blank" rel="noopener noreferrer">WhatsApp +233 54 042 2494</a>
            <a href="https://instagram.com/coppacocktailsgh" target="_blank" rel="noopener noreferrer">Instagram @coppacocktailsgh</a>
            <a href="https://snapchat.com/add/coppacocktailsgh" target="_blank" rel="noopener noreferrer">Snapchat @coppacocktailsgh</a>
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
      <img src="/images/slide1.jpg" alt="Cocktail Experience 1" class="hero-slide">
      <img src="/images/slide3.jpg" alt="Cocktail Experience 2" class="hero-slide">
      <img src="/images/celebrate-life2.jpg" alt="Cocktail Experience 3" class="hero-slide">
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

  ${BoxPromo()}

  <section id="cocktails" class="section-padding cocktails-preview">
    <div class="container">
      <div class="section-header reveal">
        <span class="tag">PREMIUM SELECTION</span>
        <h2>Our Bestsellers</h2>
        <p>Expertly crafted, ready to serve. Discover the flavors that everyone is talking about.</p>
      </div>
      <div class="cocktail-grid">
        ${cocktails.filter(c => c.bestseller).map((cocktail, i) => `
          <a class="cocktail-card reveal" href="#cocktail/${cocktail.id}" style="animation-delay: ${0.1 * (i + 1)}s">
            <div class="card-square" style="background-color: ${cocktail.color}">
              <div class="bestseller-badge">
                <span class="star">★</span> BESTSELLER
              </div>
              <img src="${cocktail.image}" alt="${cocktail.name}" loading="lazy">
              <div class="card-overlay">
                <span class="btn-view-flavor">View Details</span>
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
          </a>
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
        <a href="https://instagram.com/coppacocktailsgh" target="_blank" rel="noopener noreferrer" class="btn-insta">FOLLOW US</a>
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

// Active cocktail filter id (null = show all). Set from the URL: #cocktails?filter=<id>
let currentFilter = null;
let currentGalleryFilter = 'All';

// StoryPage logic moved to enhanced version below

const filterGroups = [
  {
    title: 'Taste Profile',
    options: [
      { id: 'tropical-fruity', label: 'Tropical & Fruity', icon: 'tropical-fruity', match: c => c.taste === 'Tropical & Fruity' },
      { id: 'citric-fresh', label: 'Citric & Fresh', icon: 'citric-fresh', match: c => c.taste === 'Citric & Fresh' },
      { id: 'sweet-smooth', label: 'Sweet & Smooth', icon: 'sweetsmooth', match: c => c.taste === 'Sweet & Smooth' },
      { id: 'bold-classic', label: 'Bold & Classic', icon: 'boldclassic', match: c => c.taste === 'Bold & Classic' }
    ]
  },
  {
    title: 'Spirit Type',
    options: [
      { id: 'rum-based', label: 'Rum-Based', icon: 'rumbased', match: c => c.spirit === 'Rum Based' },
      { id: 'tequila-based', label: 'Tequila-Based', icon: 'tequilabased', match: c => c.spirit === 'Tequila Based' },
      { id: 'vodka-based', label: 'Vodka-Based', icon: 'vodkabased', match: c => c.spirit === 'Vodka Based' },
      { id: 'other-spirits', label: 'Other Spirits', icon: 'otherspirits', match: c => c.spirit === 'Other Spirits' }
    ]
  },
  {
    title: 'Format & Serve',
    options: [
      { id: 'bottles', label: 'Bottles', icon: 'bottles', match: c => c.format === 'Bottle' }
    ]
  },
  {
    title: 'Bestsellers',
    options: [
      { id: 'bestsellers', label: 'All bestsellers', icon: 'bestsellers', match: c => c.bestseller }
    ]
  }
];

const findFilter = (id) => filterGroups.flatMap(g => g.options).find(o => o.id === id) || null;

// "OUR COCKTAILS" mega-menu: tabs on the left, image tiles on the right (built from the cocktail data)
const megaMenuGroups = () => {
  const bestsellers = cocktails.filter(c => c.bestseller);
  const filterTiles = (groupTitle) => filterGroups
    .find(g => g.title === groupTitle).options
    .map(option => ({ label: option.label, href: `#cocktails?filter=${option.id}`, bottles: cocktails.filter(option.match) }))
    .filter(tile => tile.bottles.length);
  const featured = ['margarita', 'passion-fruit-martini', 'pina-colada']
    .map(id => cocktails.find(c => c.id === id))
    .filter(Boolean);

  return [
    {
      key: 'bestsellers', title: 'Bestsellers', color: '#ffd042',
      tiles: [
        ...featured.map(c => ({ label: c.name, href: `#cocktail/${c.id}`, bottles: [c] })),
        { label: 'All bestsellers', href: '#cocktails?filter=bestsellers', bottles: bestsellers }
      ]
    },
    { key: 'taste', title: 'Taste Profile', color: '#e5ea32', tiles: filterTiles('Taste Profile') },
    { key: 'spirit', title: 'Spirit Type', color: '#ff595b', tiles: filterTiles('Spirit Type') },
    {
      key: 'format', title: 'Format & Serve', color: '#20c0ff',
      tiles: [
        ...filterTiles('Format & Serve'),
        { label: `${coppaBox.name} · ${formatCedis(coppaBox.price)}`, href: '#box', bottles: boxCocktails() },
        { label: 'Wholesale & events', href: '#wholesale', bottles: bestsellers, background: 'var(--color-forest)' }
      ]
    }
  ];
};

const megaTile = (tile) => {
  const bottles = tile.bottles.slice(0, 3);
  const background = tile.background
    || (bottles.length === 1 ? bottles[0].color : `linear-gradient(135deg, ${bottles.map(b => b.color).join(', ')})`);
  return `
    <a class="mega-tile" href="${tile.href}">
      <span class="mega-tile-visual mega-tile-visual--${bottles.length}" style="background: ${background}">
        ${bottles.map(b => `<img src="${b.image}" alt="" loading="lazy">`).join('')}
      </span>
      <span class="mega-tile-label">${tile.label}</span>
    </a>
  `;
};

const MegaMenu = () => {
  const groups = megaMenuGroups();
  return `
    <div class="mega-menu" id="mega-menu" style="--mega-bg: ${groups[0].color}" hidden>
      <div class="container mega-menu-inner">
        <div class="mega-sidebar">
          <div class="mega-tabs" role="tablist" aria-label="Browse cocktails">
            ${groups.map((g, i) => `
              <button type="button" role="tab" class="mega-tab ${i === 0 ? 'active' : ''}" id="mega-tab-${g.key}"
                aria-selected="${i === 0}" aria-controls="mega-panel-${g.key}" data-mega-tab="${g.key}" data-mega-color="${g.color}">${g.title}</button>
            `).join('')}
          </div>
          <a href="#cocktails" class="mega-all">All cocktails <span aria-hidden="true">→</span></a>
        </div>
        ${groups.map((g, i) => `
          <div class="mega-panel" role="tabpanel" id="mega-panel-${g.key}" aria-labelledby="mega-tab-${g.key}" ${i === 0 ? '' : 'hidden'}>
            ${g.tiles.map(megaTile).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

const CocktailsPage = () => {
  const activeFilter = findFilter(currentFilter);
  const filteredCocktails = activeFilter ? cocktails.filter(activeFilter.match) : cocktails;

  const bannerBottles = cocktails.filter(c => c.bestseller).slice(0, 3);

  return `
  <section class="cocktails-banner">
    <div class="container cocktails-banner-inner">
      <h1><span>Our</span> <span>Cocktails</span></h1>
      <p>Explore our range of over 13 delicious ready-to-drink cocktails.</p>
    </div>
    <div class="cocktails-banner-bottles" aria-hidden="true">
      ${bannerBottles.map(c => `<img src="${c.image}" alt="">`).join('')}
    </div>
  </section>

  <section class="section-padding cocktails-range" style="background: var(--color-cream);">
    <div class="container">
      <div class="cocktail-filter">
        <div class="filter-row">
          <button type="button" class="filter-toggle" aria-expanded="false" aria-controls="filter-panel">
            <img src="/filter-icons/filter.svg" alt="" width="18" height="18">
            <span>FILTER</span>
          </button>
          <div class="filter-chips">
            ${activeFilter ? `
              <button type="button" class="filter-chip" data-filter-clear aria-label="Remove filter: ${activeFilter.label}">
                <img src="/filter-icons/cross.svg" alt="" width="12" height="12">
                ${activeFilter.label}
              </button>
            ` : ''}
          </div>
        </div>

        <div class="filter-panel" id="filter-panel" hidden>
          ${filterGroups.map(group => `
            <div class="filter-group">
              <h2>${group.title}</h2>
              ${group.options.map(option => `
                <button type="button" class="filter-option ${option.id === currentFilter ? 'active' : ''}" data-filter-id="${option.id}" aria-pressed="${option.id === currentFilter}">
                  <img src="/filter-icons/${option.icon}.svg" alt="" width="28" height="28">
                  <span>${option.label}</span>
                </button>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>

      ${filteredCocktails.length === 0 ? '<p class="filter-empty">No cocktails match this filter yet.</p>' : ''}

      <div class="cocktail-grid">
        ${filteredCocktails.map(cocktailCard).join('')}
      </div>
    </div>
  </section>
`;
};

// One cocktail card (Our Cocktails grid and "Discover more"); links to the cocktail's page
const cocktailCard = (cocktail, i) => `
  <a class="cocktail-card reveal" href="#cocktail/${cocktail.id}" style="animation-delay: ${0.05 * i}s">
    <div class="card-square" style="background-color: ${cocktail.color}">
      ${cocktail.bestseller ? `
      <div class="bestseller-badge">
        <span class="star">★</span> BESTSELLER
      </div>` : ''}
      <img src="${cocktail.image}" alt="${cocktail.name}" loading="lazy">
    </div>
    <div class="card-info">
      <h3>${cocktail.name}</h3>
      <p>${cocktail.taste}</p>
      <p>${cocktail.spirit}</p>
      <p>${cocktail.format}</p>
    </div>
  </a>
`;

const WHATSAPP_NUMBER = '233540422494';
const STORAGE_NOTE = 'Unopened bottles keep indefinitely. Once opened, enjoy within a few weeks. Store in a cool, dark place and serve chilled.';

// Title-case a cocktail name for sentences ("PINA COLADA" -> "Pina Colada")
const titleCase = (name) => name.toLowerCase().replace(/\b\w/g, ch => ch.toUpperCase());

// Filter id (from filterGroups) that a cocktail falls under within a group, e.g. 'tropical-fruity'
const filterIdFor = (groupTitle, cocktail) =>
  filterGroups.find(g => g.title === groupTitle)?.options.find(o => o.match(cocktail))?.id;

// Up to 4 other cocktails: same taste first, then same spirit, then bestsellers
const relatedCocktails = (cocktail) => {
  const others = cocktails.filter(c => c.id !== cocktail.id);
  const ranked = [
    ...others.filter(c => c.taste === cocktail.taste),
    ...others.filter(c => c.spirit === cocktail.spirit),
    ...others.filter(c => c.bestseller),
    ...others
  ];
  return [...new Set(ranked)].slice(0, 4);
};

const ProductPage = (cocktail) => {
  const details = cocktailDetails[cocktail.id] || {};
  const name = titleCase(cocktail.name);
  const tasteId = filterIdFor('Taste Profile', cocktail);
  const spiritId = filterIdFor('Spirit Type', cocktail);
  const orderMessage = encodeURIComponent(
    `Hello Coppa Cocktails Ghana, I'd like to order ${name} (${details.volume || '0.7 L'} bottle). Please share the price and availability.`
  );
  const nutritionRows = details.nutrition ? [
    ['Energy', details.nutrition.energy],
    ['Fat', details.nutrition.fat],
    ['Carbohydrates', details.nutrition.carbohydrates],
    ['of which sugars', details.nutrition.sugars],
    ['Protein', details.nutrition.protein],
    ['Salt', details.nutrition.salt]
  ].filter(([, value]) => value) : [];

  return `
  <section class="product-page" style="--product-color: ${cocktail.color}">
    <div class="container">
      <nav class="product-breadcrumb" aria-label="Breadcrumb">
        <a href="#cocktails">Our Cocktails</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">${name}</span>
      </nav>

      <div class="product-hero">
        <div class="product-visual">
          ${cocktail.bestseller ? `
          <div class="bestseller-badge">
            <span class="star">★</span> BESTSELLER
          </div>` : ''}
          <img src="${cocktail.image}" alt="${name} bottle">
        </div>

        <div class="product-summary">
          <p class="product-tags">
            ${tasteId ? `<a href="#cocktails?filter=${tasteId}">${cocktail.taste}</a>` : cocktail.taste}
            <span aria-hidden="true">•</span>
            ${spiritId ? `<a href="#cocktails?filter=${spiritId}">${cocktail.spirit}</a>` : cocktail.spirit}
          </p>
          <h1>${cocktail.name}</h1>

          <ul class="product-facts">
            <li><strong>${details.volume || '0.7 L'}</strong><span>Bottle</span></li>
            ${details.abv ? `<li><strong>${details.abv}</strong><span>ABV</span></li>` : ''}
            ${details.kcal ? `<li><strong>${details.kcal}</strong><span>kcal / 100 ml</span></li>` : ''}
            ${(details.dietary || []).map(tag => `<li class="product-fact-tag">${tag}</li>`).join('')}
          </ul>

          ${details.awards && details.awards.length ? `
          <div class="product-awards">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 13.8 7 22l5-3 5 3-1.5-8.2"/><path d="m12 6 .9 1.9 2.1.3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 8.2l2.1-.3z"/></svg>
            <ul>${details.awards.map(award => `<li>${award}</li>`).join('')}</ul>
          </div>` : ''}

          ${details.serve ? `
          <div class="product-serve">
            <h2>How to serve</h2>
            <p>${details.serve}</p>
          </div>` : ''}

          <div class="product-actions">
            <a class="product-btn product-btn--primary" href="https://wa.me/${WHATSAPP_NUMBER}?text=${orderMessage}" target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>
            <a class="product-btn" href="#find-us">Where to buy</a>
          </div>
          ${coppaBox.cocktailIds.includes(cocktail.id) ? `
          <a class="product-box-callout" href="#box">
            <span>Also in <strong>${coppaBox.name}</strong>: ${coppaBox.cocktailIds.length} cocktails for ${formatCedis(coppaBox.price)}</span>
            <span aria-hidden="true">→</span>
          </a>` : ''}
          <p class="product-note">Ready to drink — just add ice. For adults 18+ only. Please enjoy responsibly.</p>
        </div>
      </div>

      <div class="product-details">
        ${details.ingredients ? `
        <details class="product-accordion" open>
          <summary>Ingredients</summary>
          <p>${details.ingredients}.</p>
        </details>` : ''}
        ${nutritionRows.length ? `
        <details class="product-accordion">
          <summary>Nutritional value per 100 ml</summary>
          <table class="nutrition-table">
            <tbody>
              ${nutritionRows.map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`).join('')}
            </tbody>
          </table>
        </details>` : ''}
        <details class="product-accordion">
          <summary>Storage</summary>
          <p>${STORAGE_NOTE}</p>
        </details>
      </div>
    </div>
  </section>

  <section class="product-related section-padding">
    <div class="container">
      <h2>Discover more</h2>
      <div class="cocktail-grid">
        ${relatedCocktails(cocktail).map(cocktailCard).join('')}
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
                <input type="text" name="name" placeholder="Your full name" required>
              </div>
              <div class="form-group">
                <label>EMAIL</label>
                <input type="email" name="email" placeholder="Your email address" required>
              </div>
            </div>
            <div class="form-group">
              <label>MESSAGE</label>
              <textarea name="message" placeholder="How can we help you?" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn-submit-premium" style="width: 100%;">
              <span>SEND VIA WHATSAPP</span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
            </button>
          </form>
          
          <div class="whatsapp-alternative" style="margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 30px;">
            <p style="margin-bottom: 15px; color: #666; font-family: var(--font-heading); letter-spacing: 0.1em; font-size: 14px;">OR REACH US DIRECTLY ON WHATSAPP</p>
            <a href="https://wa.me/233540422494" target="_blank" rel="noopener noreferrer" class="whatsapp-btn-large" style="margin: 0 auto;">
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
    <div class="wholesale-hero-bg" style="background-image: url('/images/slide3.jpg')"></div>
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
              <input type="text" name="business" placeholder="e.g. The Gold Lounge Accra" required>
            </div>
            <div class="form-group">
              <label>BUSINESS TYPE</label>
              <select name="type" required>
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
                <input type="text" name="contact" placeholder="Kofi Mensah" required>
              </div>
              <div class="form-group">
                <label>PHONE</label>
                <input type="tel" name="phone" placeholder="+233 54 042 2494" required>
              </div>
            </div>
            <div class="form-group">
              <label>EMAIL</label>
              <input type="email" name="email" placeholder="kofi@venue.com" required>
            </div>
            <div class="form-group">
              <label>MESSAGE</label>
              <textarea name="message" placeholder="Tell us about your business needs..." rows="4" required></textarea>
            </div>
            <button type="submit" class="btn-submit-premium">
              <span>SUBMIT ENQUIRY VIA WHATSAPP</span>
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
    <div class="about-hero-bg" style="background-image: url('/images/slide1.jpg')"></div>
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
        <p>MB Logistics is the sole importer and distributor of Coppa Cocktails in Ghana</p>
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
      <img src="/images/celebrate-life3.jpg" alt="Coppa Vibe" class="gallery-hero-bg">
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
                  <a href="https://maps.google.com/?q=${encodeURIComponent(loc.name + ' ' + loc.address)}" target="_blank" rel="noopener noreferrer" class="loc-map-btn">
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

let lastRoute = null;
const DEFAULT_TITLE = document.title;

const router = () => {
  // Hash may carry a query, e.g. #cocktails?filter=tropical-fruity
  const [route, query = ''] = (window.location.hash || '#').split('?');
  const hash = route || '#';
  const filterParam = new URLSearchParams(query).get('filter');
  currentFilter = findFilter(filterParam) ? filterParam : null;
  let content = '';
  let pageTitle = DEFAULT_TITLE;

  if (hash === '#') {
    content = HomePage();
  } else if (hash === '#cocktails') {
    content = CocktailsPage();
  } else if (hash.startsWith('#cocktail/') && cocktails.some(c => c.id === hash.slice('#cocktail/'.length))) {
    // Product page, e.g. #cocktail/mojito (only ids that exist in the data are rendered)
    const cocktail = cocktails.find(c => c.id === hash.slice('#cocktail/'.length));
    content = ProductPage(cocktail);
    pageTitle = `${titleCase(cocktail.name)} | Coppa Cocktails Ghana`;
  } else if (hash === '#box') {
    content = BoxPage();
    pageTitle = `${coppaBox.name} (${formatCedis(coppaBox.price)}) | Coppa Cocktails Ghana`;
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
    <a href="https://wa.me/233540422494" target="_blank" rel="noopener noreferrer" class="whatsapp-float" aria-label="Chat on WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="35" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
    </a>
  `;

  document.title = pageTitle;

  // Release scroll lock if the lightbox was open when navigating away (e.g. browser back)
  document.body.style.overflow = '';

  // Only jump to the top when moving to a different page, not when changing a filter
  const routeChanged = hash !== lastRoute;
  lastRoute = hash;

  initInteractions(routeChanged);
};

const initInteractions = (routeChanged = true) => {
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

  if (window.revealObserver) window.revealObserver.disconnect();
  window.revealObserver = revealObserver;

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

  if (window.handleParallax) {
    window.removeEventListener('scroll', window.handleParallax);
    window.handleParallax = null;
  }

  if (parallaxItems.length > 0) {
    window.handleParallax = handleParallax;
    window.addEventListener('scroll', window.handleParallax, { passive: true });
    window.handleParallax(); // Initial call
  }

  // Phone/tablet menu: the toggle opens the nav as a full-screen panel and locks page scroll
  const siteHeader = document.querySelector('.header');
  const menuToggle = siteHeader && siteHeader.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => setMobileMenuOpen(!siteHeader.classList.contains('menu-open')));
    // Links to the page you're already on don't re-render, so close the menu explicitly
    siteHeader.querySelectorAll('.nav-menu a, .header-order').forEach(link => {
      link.addEventListener('click', () => setMobileMenuOpen(false));
    });
    siteHeader.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteHeader.classList.contains('menu-open')) {
        setMobileMenuOpen(false);
        menuToggle.focus();
      }
    });
  }

  // "OUR COCKTAILS" mega-menu (desktop with a mouse only; elsewhere the trigger is a plain link)
  const navDropdown = document.querySelector('.nav-dropdown');
  const megaMenu = navDropdown && navDropdown.querySelector('.mega-menu');
  if (navDropdown && megaMenu) {
    const trigger = navDropdown.querySelector('.nav-dropdown-trigger');
    const desktopPointer = window.matchMedia('(hover: hover) and (min-width: 1024px)');
    let closeTimer;
    const openMenu = () => {
      if (!desktopPointer.matches) return;
      clearTimeout(closeTimer);
      megaMenu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    };
    const closeMenu = () => {
      clearTimeout(closeTimer);
      megaMenu.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    };
    // Short delay so the pointer can cross the gap between the link and the panel
    const closeMenuSoon = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeMenu, 200);
    };

    navDropdown.addEventListener('mouseenter', openMenu);
    navDropdown.addEventListener('mouseleave', closeMenuSoon);
    navDropdown.addEventListener('focusin', openMenu);
    navDropdown.addEventListener('focusout', (e) => {
      if (!navDropdown.contains(e.relatedTarget)) closeMenuSoon();
    });
    navDropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !megaMenu.hidden) {
        closeMenu();
        trigger.focus();
      }
    });

    const megaTabs = navDropdown.querySelectorAll('[data-mega-tab]');
    megaTabs.forEach(tab => {
      const activate = () => {
        megaTabs.forEach(t => {
          const selected = t === tab;
          t.classList.toggle('active', selected);
          t.setAttribute('aria-selected', String(selected));
          document.getElementById(`mega-panel-${t.dataset.megaTab}`).hidden = !selected;
        });
        megaMenu.style.setProperty('--mega-bg', tab.dataset.megaColor);
      };
      tab.addEventListener('mouseenter', activate);
      tab.addEventListener('focus', activate);
      tab.addEventListener('click', activate);
    });
  }

  // Cocktail filter: FILTER button opens the panel; choosing an option updates the URL,
  // which re-renders the page through the router. Choosing the active option clears it.
  const setFilter = (id) => {
    window.location.hash = id ? `#cocktails?filter=${encodeURIComponent(id)}` : '#cocktails';
  };

  document.querySelectorAll('[data-filter-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filterId === currentFilter ? null : btn.dataset.filterId);
    });
  });

  document.querySelectorAll('[data-filter-clear]').forEach(btn => {
    btn.addEventListener('click', () => setFilter(null));
  });

  const filterToggle = document.querySelector('.filter-toggle');
  const filterPanel = document.getElementById('filter-panel');
  if (filterToggle && filterPanel) {
    const setPanelOpen = (open) => {
      filterPanel.hidden = !open;
      filterToggle.setAttribute('aria-expanded', String(open));
      filterToggle.classList.toggle('is-open', open);
    };
    filterToggle.addEventListener('click', () => setPanelOpen(filterPanel.hidden));
    filterToggle.closest('.cocktail-filter').addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !filterPanel.hidden) {
        setPanelOpen(false);
        filterToggle.focus();
      }
    });
  }

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

  // Drop the previous page's lightbox key handler so it can't act on a detached lightbox
  if (window.handleKeydown) {
    document.removeEventListener('keydown', window.handleKeydown);
    window.handleKeydown = null;
  }

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

    window.handleKeydown = handleKeydown;
    document.addEventListener('keydown', window.handleKeydown);
  }

  // Coppa Box order form: quantity stepper, live total, address only needed for delivery
  const boxForm = document.getElementById('box-order-form');
  if (boxForm) {
    const quantityInput = boxForm.elements.quantity;
    const totalEl = boxForm.querySelector('[data-box-total]');
    const addressGroup = boxForm.querySelector('[data-address-group]');
    const updateBoxForm = () => {
      totalEl.textContent = formatCedis(clampBoxQuantity(quantityInput.value) * coppaBox.price);
      const delivering = boxForm.elements.fulfilment.value === 'delivery';
      addressGroup.hidden = !delivering;
      boxForm.elements.address.required = delivering;
    };

    boxForm.querySelectorAll('[data-qty-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        quantityInput.value = clampBoxQuantity(clampBoxQuantity(quantityInput.value) + Number(btn.dataset.qtyStep));
        updateBoxForm();
      });
    });
    // Tidy the typed quantity (e.g. 0 or 70) once the field is left
    quantityInput.addEventListener('change', () => {
      quantityInput.value = clampBoxQuantity(quantityInput.value);
    });
    boxForm.addEventListener('input', updateBoxForm);
    boxForm.addEventListener('change', updateBoxForm);
    boxForm.addEventListener('reset', () => setTimeout(updateBoxForm));
    updateBoxForm();
  }

  // Handle Forms: open WhatsApp with the form contents as a pre-filled message
  const forms = document.querySelectorAll('.premium-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const field = (name) => (form.elements[name]?.value || '').trim();

      let lines;
      if (form.id === 'wholesale-form') {
        const typeSelect = form.elements.type;
        lines = [
          'Hello Coppa Cocktails Ghana, I have a wholesale enquiry.',
          '',
          `Business name: ${field('business')}`,
          `Business type: ${typeSelect.options[typeSelect.selectedIndex].text}`,
          `Contact person: ${field('contact')}`,
          `Phone: ${field('phone')}`,
          `Email: ${field('email')}`,
          '',
          field('message')
        ];
      } else if (form.id === 'box-order-form') {
        const quantity = clampBoxQuantity(field('quantity'));
        const delivering = form.elements.fulfilment.value === 'delivery';
        lines = [
          'Hello Coppa Cocktails Ghana, I would like to place an order.',
          '',
          `Order: ${quantity} x ${coppaBox.name} (${formatCedis(coppaBox.price)} each)`,
          `In each box: ${boxCocktails().map(c => titleCase(c.name)).join(', ')}`,
          `Total: ${formatCedis(quantity * coppaBox.price)}`,
          '',
          `Name: ${field('name')}`,
          `Phone: ${field('phone')}`,
          delivering ? `Delivery to: ${field('address')}` : 'I will pick up the order.',
          ...(field('note') ? [`Note: ${field('note')}`] : [])
        ];
      } else {
        lines = [
          'Hello Coppa Cocktails Ghana,',
          '',
          `Name: ${field('name')}`,
          `Email: ${field('email')}`,
          '',
          field('message')
        ];
      }

      const url = `https://wa.me/233540422494?text=${encodeURIComponent(lines.join('\n'))}`;
      const win = window.open(url, '_blank');
      if (win) {
        win.opener = null;
        form.reset();
      } else {
        // Pop-up blocked: open WhatsApp in this tab instead so the message isn't lost
        window.location.href = url;
      }
    });
  });

  if (routeChanged) window.scrollTo(0, 0);
};

// Open/close the phone & tablet menu (header is re-rendered on every page, so this looks it up each time)
function setMobileMenuOpen(open) {
  const header = document.querySelector('.header');
  const toggle = header && header.querySelector('.menu-toggle');
  // No-op if already in that state, so closing never unlocks scroll that something else (the lightbox) locked
  if (!toggle || header.classList.contains('menu-open') === open) return;
  header.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
}

// The menu panel only exists below 1024px: close it if the window is widened past that
window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
  if (e.matches) setMobileMenuOpen(false);
});

// Close the cocktail filter panel when clicking anywhere outside it
document.addEventListener('click', (e) => {
  const panel = document.getElementById('filter-panel');
  if (panel && !panel.hidden && !e.target.closest('.cocktail-filter')) {
    panel.hidden = true;
    const toggle = document.querySelector('.filter-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('is-open');
    }
  }
});

window.addEventListener('hashchange', router);
router();
