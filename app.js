(() => {
  'use strict';

  const STORAGE_KEY = 'campusMarketplaceCart';

  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones Pro Max',
      category: 'Electronics',
      price: 1299,
      oldPrice: 2500,
      image: 'images/84161086784507225.jpg',
      
    },
    {
      id: 2,
      name: 'University Textbook - Advanced Mathematics',
      category: 'Books',
      price: 450,
      oldPrice: 650,
      image:'images/A5 Notebooks Free branding WhatsApp 0740282041 or….jpg'
    },
    {
      id: 3,
      name: 'wireless earpiece',
      category: 'Sports',
      price: 1899,
      oldPrice: 2800,
      image: 'images/84161086784507225.png',
     
    },
    {
      id: 4,
      name: 'NoteBooks',
      category: 'Books',
      price: 2499,
      oldPrice: 3999,
      image:'images/Black Books.jpg'
    },
    {
      id: 5,
      name: 'Portable Bluetooth Speaker Waterproof',
      category: 'Electronics',
      price: 899,
      oldPrice: 1500,
      image:'images/84161086784507225.jpg'
    },
    {
      id: 6,
      name: 'Mens Wide Leg Dress Pants',
      category: 'clothes',
      price: 1199,
      oldPrice: 1800,
      images:'images/Mens Wide Leg Dress Pants in 10 Colors Pleated Slacks - Brown _ Dress Size Pants _ 28.jpg'
    },
    {
      id: 7,
      name: 'Desk LED Lamp with Wireless Charger',
      category: 'Home & Living',
      price: 1499,
      oldPrice: 2200,
      icon: '💡'
    },
    {
      id: 8,
      name: 'Organic Green Tea Box - 25 Bags',
      category: 'Groceries',
      price: 399,
      oldPrice: 550,
      icon: '🍵'
    },
    {
      id: 9,
      name: "Men's Gray Scarf",
      category: 'Fashion',
      price: 1299,
      oldPrice: 1800,
      image: "images/15 Best Men's Scarves to Stay Stylish and Warm in___.jpg",
      icon: '🧣'
    },
    {
      id: 10,
      name: 'A4 Campus Notebook',
      category: 'Stationery',
      price: 250,
      oldPrice: 320,
      icon: '📒'
    },
    {
      id: 11,
      name: 'Data structure course',
      category: 'courses',
      price: 750,
      oldPrice: 950,
      image:'images/Learn Data structure and algorithms & system design.jpg'
    },
    {
      id: 12,
      name: 'laptop',
      category: 'electronics',
      price: 499,
      oldPrice: 700,
      image:'images/62135669854165478.jpg'
    }
  ];

  let currentCategory = 'All';
  let currentSearch = '';

  function money(value) {
    return `KSh ${Number(value || 0).toLocaleString()}`;
  }

  function loadCart() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map(item => ({
          id: Number(item.id),
          quantity: Math.max(1, Number(item.quantity) || 1)
        }))
        .filter(item => getProduct(item.id));
    } catch (error) {
      console.warn('Could not load cart:', error);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.warn('Could not save cart:', error);
    }
  }

  function getProduct(id) {
    return products.find(product => product.id === Number(id));
  }

  function cartCount(cart = loadCart()) {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function cartSubtotal(cart = loadCart()) {
    return cart.reduce((total, item) => {
      const product = getProduct(item.id);

      if (!product) {
        return total;
      }

      return total + product.price * item.quantity;
    }, 0);
  }

  function getFilteredProducts() {
    const search = currentSearch.trim().toLowerCase();

    return products.filter(product => {
      const matchesCategory =
        currentCategory === 'All' ||
        product.category.toLowerCase() === currentCategory.toLowerCase();

      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }

  function imageMarkup(product) {
    if (!product.image) {
      return `
        <div class="product-img-fallback" aria-label="${product.name}">
          ${product.icon}
        </div>
      `;
    }

    const safeImage = product.image.replace(/"/g, '&quot;');

    return `
      <div class="product-img-local">
        <img
          src="${safeImage}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.style.display='none'; this.parentElement.classList.add('product-img-fallback'); this.parentElement.insertAdjacentHTML('beforeend', '<span>${product.icon}</span>');"
        >
      </div>
    `;
  }

  function productCard(product) {
    return `
      <article class="product-card"       data-product-id="${product.id}">
      ,  ${imageMarkup(product)}

        <div class="product-info">
          <span class="product-category">${product.category}</span>

          <h3>${product.name}</h3>

          <div class="product-price">
            <span class="current-price">${money(product.price)}</span>
          </div>

          <div class="product-actions">
            <button
              type="button"
              class="btn-add-cart"
              data-action="add"
              data-product-id="${product.id}"
            >
              Add to Cart
            </button>

            <button
              type="button"
              class="btn-buy-now"
              data-action="buy"
              data-product-id="${product.id}"
            >
              Buy Now
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const grid = document.querySelector('.product-grid');

    if (!grid) {
      return;
    }

    const filteredProducts = getFilteredProducts();

    if (filteredProducts.length === 0) {
      grid.innerHTML = `
        <div class="empty-products">
          <h3>No products found</h3>
          <p>Try another search term or category.</p>
        </div>
      `;
    } else {
      grid.innerHTML = filteredProducts.map(productCard).join('');
    }

    const heading = document.querySelector('.products-section h2');

    if (heading) {
      if (currentSearch) {
        heading.textContent = `Search results for "${currentSearch}"`;
      } else if (currentCategory !== 'All') {
        heading.textContent = currentCategory;
      } else {
        heading.textContent = 'Trending Products';
      }
    }
  }

  function setCategory(category) {
    currentCategory = category || 'All';

    document.querySelectorAll('.cat-nav a').forEach(link => {
      const linkCategory = link.dataset.category || link.textContent.trim();

      link.classList.toggle(
        'active',
        linkCategory.toLowerCase() === currentCategory.toLowerCase()
      );
    });

    renderProducts();
  }

  function runSearch(searchTerm) {
    currentSearch = searchTerm.trim();

    renderProducts();
  }

  function addToCart(productId, quantity = 1) {
    const product = getProduct(productId);

    if (!product) {
      return;
    }

    const cart = loadCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        quantity
      });
    }

    saveCart(cart);
    updateCartBadges();
    renderCartPage();

    showMessage(`${product.name} added to cart.`);
  }

  function updateQuantity(productId, change) {
    const cart = loadCart();
    const item = cart.find(cartItem => cartItem.id === Number(productId));

    if (!item) {
      return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
      const updatedCart = cart.filter(cartItem => cartItem.id !== Number(productId));
      saveCart(updatedCart);
    } else {
      saveCart(cart);
    }

    updateCartBadges();
    renderCartPage();
  }

  function removeFromCart(productId) {
    const cart = loadCart().filter(
      item => item.id !== Number(productId)
    );

    saveCart(cart);
    updateCartBadges();
    renderCartPage();

    showMessage('Item removed from cart.');
  }

  function renderCartPage() {
    const cartContainer = document.querySelector('[data-cart-items]');

    if (!cartContainer) {
      return;
    }

    const cart = loadCart();

    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart">
          <h3>Your cart is empty</h3>
          <p>Add some products from the marketplace.</p>
          <a href="index.html">Continue Shopping</a>
        </div>
      `;
    } else {
      cartContainer.innerHTML = cart.map(item => {
        const product = getProduct(item.id);

        if (!product) {
          return '';
        }

        return `
          <div class="order-item" data-product-id="${product.id}">
            <div class="order-item-image">
              ${
                product.image
                  ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none';">`
                  : `<span>${product.icon}</span>`
              }
            </div>

            <div class="order-item-info">
              <h3>${product.name}</h3>
              <p>${product.category}</p>
              <strong>${money(product.price)}</strong>

              <button
                type="button"
                class="cart-remove"
                data-cart-action="remove"
                data-product-id="${product.id}"
              >
                Remove
              </button>
            </div>

            <div class="oi-qty">
              <button
                type="button"
                data-cart-action="decrease"
                data-product-id="${product.id}"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>${item.quantity}</span>

              <button
                type="button"
                data-cart-action="increase"
                data-product-id="${product.id}"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div class="order-item-total">
              ${money(product.price * item.quantity)}
            </div>
          </div>
        `;
      }).join('');
    }

    const subtotal = cartSubtotal(cart);
    const delivery = 0;
    const tax = subtotal * 0.16;
    const total = subtotal + delivery + tax;

    const subtotalElement = document.querySelector('[data-subtotal]');
    const deliveryElement = document.querySelector('[data-delivery]');
    const taxElement = document.querySelector('[data-tax]');
    const totalElement = document.querySelector('[data-total]');

    if (subtotalElement) {
      subtotalElement.textContent = money(subtotal);
    }

    if (deliveryElement) {
      deliveryElement.textContent = money(delivery);
    }

    if (taxElement) {
      taxElement.textContent = money(tax);
    }

    if (totalElement) {
      totalElement.textContent = money(total);
    }
  }

  function updateCartBadges() {
    const count = cartCount();

    document.querySelectorAll('.cart-count, .cart-badge').forEach(badge => {
      badge.textContent = count;
    });
  }

  function showMessage(message) {
    const existingMessage = document.querySelector('.app-message');

    if (existingMessage) {
      existingMessage.remove();
    }

    const messageElement = document.createElement('div');

    messageElement.className = 'app-message';
    messageElement.textContent = message;

    Object.assign(messageElement.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '9999',
      padding: '12px 18px',
      borderRadius: '6px',
      background: '#222',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,.2)'
    });

    document.body.appendChild(messageElement);

    window.setTimeout(() => {
      messageElement.remove();
    }, 2500);
  }

  function setupSearch() {
    const searchInput = document.querySelector('.nav-search input');
    const searchButton = document.querySelector('.nav-search button');

    if (!searchInput) {
      return;
    }

    const submitSearch = event => {
      if (event) {
        event.preventDefault();
      }

      runSearch(searchInput.value);

      const productsSection = document.querySelector('#products');

      if (productsSection) {
        productsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    };

    searchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        submitSearch(event);
      }
    });

    if (searchButton) {
      searchButton.addEventListener('click', submitSearch);
    }
  }

  function setupCategories() {
    document.querySelectorAll('.cat-nav a').forEach(link => {
      link.addEventListener('click', event => {
        const href = link.getAttribute('href');

        event.preventDefault();

        let category =
          link.dataset.category ||
          link.textContent.trim();

        if (
          !category ||
          category.toLowerCase() === 'all' ||
          href === '#'
        ) {
          category = 'All';
        }

        setCategory(category);

        const productsSection = document.querySelector('#products');

        if (productsSection) {
          productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  function setupProductActions() {
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-action]');

      if (!button) {
        return;
      }

      const productId = Number(button.dataset.productId);
      const action = button.dataset.action;

      if (action === 'add') {
        addToCart(productId);
      }

      if (action === 'buy') {
        addToCart(productId);
        window.location.href = 'checkout.html';
      }
    });
  }

  function setupCartActions() {
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-cart-action]');

      if (!button) {
        return;
      }

      const productId = Number(button.dataset.productId);
      const action = button.dataset.cartAction;

      if (action === 'increase') {
        updateQuantity(productId, 1);
      }

      if (action === 'decrease') {
        updateQuantity(productId, -1);
      }

      if (action === 'remove') {
        removeFromCart(productId);
      }
    });
  }

  function setupCheckoutForm() {
    const form = document.querySelector('[data-checkout-form]');

    if (!form) {
      return;
    }

    form.addEventListener('submit', event => {
      event.preventDefault();

      const cart = loadCart();

      if (cart.length === 0) {
        showMessage('Your cart is empty.');
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      showMessage('Order details accepted. Payment processing is not connected in this demo.');

      form.reset();
    });
  }

  function setupSettings() {
    const tabButtons = document.querySelectorAll(
      '.settings-tabs button'
    );

    const panels = document.querySelectorAll(
      '.settings-panel'
    );

    if (!tabButtons.length || !panels.length) {
      return;
    }

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.dataset.target;

        tabButtons.forEach(tab => {
          tab.classList.remove('active');
        });

        panels.forEach(panel => {
          panel.hidden = true;
        });

        button.classList.add('active');

        const targetPanel = document.querySelector(
          `[data-panel="${target}"]`
        );

        if (targetPanel) {
          targetPanel.hidden = false;
        }
      });
    });
  }

  function init() {
    setupSearch();
    setupCategories();
    setupProductActions();
    setupCartActions();
    setupCheckoutForm();
    setupSettings();

    renderProducts();
    renderCartPage();
    updateCartBadges();
  }

  document.addEventListener('DOMContentLoaded', init, {
    once: true
  });
})();