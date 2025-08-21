// Enhanced Add to Cart Feature Implementation
document.addEventListener('DOMContentLoaded', function() {
  const productId = new URLSearchParams(window.location.search).get('id');
  const productDetail = document.getElementById('product-detail');

  if (!productId) {
    productDetail.innerHTML = '<p>No product selected. Please go back to the product list.</p>';
    return;
  }

  // Sample product data with variations
  const sampleProducts = [
    {
      id: 101,
      title: "Premium Cotton T-Shirt",
      price: 25.33,
      description: "High-quality cotton t-shirt available in multiple colors and sizes",
      image: "/assets/IMAGE/red color.webp",
      variations: {
        size: ["S", "M", "L", "XL", "XXL"],
        color: [
          { name: "Red", image: "/assets/IMAGE/red color.webp", available: true },
          { name: "White", image: "/assets/IMAGE/white.webp", available: true },
          { name: "Blue", image: "/assets/IMAGE/blue.webp", available: true },
          { name: "Black", image: "/assets/IMAGE/black.webp", available: true }
        ]
      }
    },
    {
      id: 102,
      title: "Designer Watch",
      price: 55.00,
      description: "Elegant wrist watch with leather strap",
      image: "https://example.com/image2.jpg",
      variations: {
        size: ["Medium", "Large"],
        color: [
          { name: "Black", image: "https://example.com/image2-black.jpg", available: true },
          { name: "Brown", image: "https://example.com/image2-brown.jpg", available: true }
        ]
      }
    }
  ];

  const product = sampleProducts.find(p => p.id == productId);
  if (!product) {
    productDetail.innerHTML = '<p>Product not found.</p>';
    return;
  }

  // Enhanced Cart Management System
  const CartManager = {
    getCart: () => JSON.parse(localStorage.getItem('cart')) || [],
    
    saveCart: (cart) => {
      localStorage.setItem('cart', JSON.stringify(cart));
      CartManager.updateCartCount();
    },
    
    addToCart: (product, size, color, quantity) => {
      let cart = CartManager.getCart();
      const cartItemId = `${product.id}-${size}-${color}`;
      
      const existingItemIndex = cart.findIndex(item => 
        item.cartItemId === cartItemId
      );
      
      const cartItem = {
        ...product,
        cartItemId,
        selectedSize: size,
        selectedColor: color,
        quantity: quantity,
        addedAt: new Date().toISOString()
      };
      
      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
      } else {
        cart.push(cartItem);
      }
      
      CartManager.saveCart(cart);
      return cart;
    },
    
    updateCartCount: () => {
      const cart = CartManager.getCart();
      const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      
      const cartCountElements = document.querySelectorAll('#cart-count');
      cartCountElements.forEach(element => {
        if (element) element.textContent = totalItems;
      });
    },
    
    clearCart: () => {
      localStorage.removeItem('cart');
      CartManager.updateCartCount();
    }
  };

  // Render product details
  function renderProductDetails(product) {
    productDetail.innerHTML = `
      <div class="product-container">
        <div class="product-image">
          <img id="product-main-image" src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-info">
          <h1>${product.title}</h1>
          <div class="price" id="product-price">$${product.price.toFixed(2)}</div>
          <div class="description">${product.description}</div>
          
          <div class="variations">
            <label for="size-select">Size:</label>
            <select id="size-select" required>
              <option value="">Select Size</option>
              ${product.variations.size.map(size => `<option value="${size}">${size}</option>`).join('')}
            </select>
            
            <label for="color-select">Color:</label>
            <select id="color-select" required>
              <option value="">Select Color</option>
              ${product.variations.color.map(color => `
                <option value="${color.name}" ${color.available ? '' : 'disabled'}>
                  ${color.name} ${color.available ? '' : '(Unavailable)'}
                </option>`).join('')}
            </select>
          </div>
          
          <div class="quantity-selector">
            <button id="decrease-qty" type="button" aria-label="Decrease quantity">−</button>
            <input type="number" id="quantity-input" value="1" min="1" max="10" readonly />
            <button id="increase-qty" type="button" aria-label="Increase quantity">+</button>
          </div>
          
          <div class="total-price" id="total-price">$${product.price.toFixed(2)}</div>
          
          <button class="add-to-cart" id="add-to-cart-btn" type="button">
            <span>Add to Cart</span>
            <span class="cart-icon">🛒</span>
          </button>
          
          <div id="add-to-cart-message" class="add-to-cart-message" style="display:none;">
            <span class="message-text">Added to Cart!</span>
            <span class="message-icon">✓</span>
          </div>
          
          <div id="validation-message" class="validation-message" style="display:none;"></div>
        </div>
      </div>
    `;

    // Initialize elements
    const colorSelect = document.getElementById('color-select');
    const sizeSelect = document.getElementById('size-select');
    const quantityInput = document.getElementById('quantity-input');
    const addToCartButton = document.getElementById('add-to-cart-btn');
    const addToCartMessage = document.getElementById('add-to-cart-message');

    // Quantity controls
    document.getElementById('decrease-qty').addEventListener('click', () => {
      let qty = parseInt(quantityInput.value);
      if (qty > 1) quantityInput.value = qty - 1;
    });

    document.getElementById('increase-qty').addEventListener('click', () => {
      let qty = parseInt(quantityInput.value);
      if (qty < 10) quantityInput.value = qty + 1;
    });

    // Add to cart functionality
    addToCartButton.addEventListener('click', () => {
      const size = sizeSelect.value;
      const color = colorSelect.value;
      const quantity = parseInt(quantityInput.value);

      if (!size || !color) {
        alert('Please select both size and color');
        return;
      }

      CartManager.addToCart(product, size, color, quantity);
      
      // Show success message
      addToCartMessage.style.display = 'flex';
      setTimeout(() => {
        addToCartMessage.style.display = 'none';
      }, 3000);
    });

    // Update cart count on load
    CartManager.updateCartCount();
  }

  renderProductDetails(product);
});

// Add CSS styles for enhanced cart functionality
const style = document.createElement('style');
style.textContent = `
  .add-to-cart {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .add-to-cart:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }

  .add-to-cart-message {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    display: none;
    align-items: center;
    gap: 10px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .validation-message {
    color: #dc3545;
    font-size: 14px;
    margin-top: 10px;
  }

  .quantity-selector {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .quantity-selector button {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
  }

  .quantity-selector input {
    width: 50px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;
document.head.appendChild(style);
