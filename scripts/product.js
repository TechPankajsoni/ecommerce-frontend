
document.addEventListener('DOMContentLoaded', function() {
  const productId = new URLSearchParams(window.location.search).get('id');
  const productDetail = document.getElementById('product-detail');

  if (!productId) {
    productDetail.innerHTML = '<p>No product selected. Please go back to the product list.</p>';
    return;
  }

  // Show loading state
  productDetail.innerHTML = '<div class="loading">Loading product details...</div>';

  // Sample product data with variations
  const sampleProducts = [
    {
      id: 101,
      title: "Product 101",
      price: 25.33,
      description: "all color t shirt",
      image: "/assets/IMAGE/red color.webp",
      variations: {
        size: ["S", "M", "L", "XL"],
        color: [
          { name: "Red", image: "/assets/IMAGE/red color.webp", available: true },
          { name: "white", image: "/assets/IMAGE/white.webp", available: false },
          { name: "blue", image: "/assets/IMAGE/blue.webp", available: true }
        ]
      }
    },
    {
      id: 102,
      title: "Product 102",
      price: 55.00,
      description: "Description for Product 2",
      image: "https://example.com/image2.jpg",
      variations: {
        size: ["M", "L"],
        color: [
          { name: "Black", image: "https://example.com/image2-black.jpg", available: true },
          { name: "White", image: "https://example.com/image2-white.jpg", available: true }
        ]
      }
    }
  ];

  // Find product by id from sample data
  const product = sampleProducts.find(p => p.id == productId);

  if (!product) {
    productDetail.innerHTML = '<p>Product not found.</p>';
    return;
  }

  // Render product details with variation selectors
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
            <select id="size-select">
              ${product.variations.size.map(size => `<option value="${size}">${size}</option>`).join('')}
            </select>
            <label for="color-select">Color:</label>
            <select id="color-select">
              ${product.variations.color.map(color => `
                <option value="${color.name}" ${color.available ? '' : 'disabled'}>
                  ${color.name} ${color.available ? '' : '(Unavailable)'}
                </option>`).join('')}
            </select>
          </div>
          <div class="quantity-selector">
            <button id="decrease-qty">−</button>
            <input type="text" id="quantity-input" value="1" readonly />
            <button id="increase-qty">+</button>
          </div>
          <div class="total-price" id="total-price">$${product.price.toFixed(2)}</div>
          <button class="add-to-cart">Add to Cart</button>
          <div id="add-to-cart-message" class="add-to-cart-message" style="display:none;"></div>
        </div>
      </div>
    `;

    // Elements
    const colorSelect = document.getElementById('color-select');
    const sizeSelect = document.getElementById('size-select');
    const mainImage = document.getElementById('product-main-image');
    const decreaseQtyBtn = document.getElementById('decrease-qty');
    const increaseQtyBtn = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('quantity-input');
    const totalPriceElement = document.getElementById('total-price');
    const addToCartButton = document.querySelector('.add-to-cart');
    const addToCartMessage = document.getElementById('add-to-cart-message');

    const maxQuantity = 10;
    const minQuantity = 1;

    // Load stored selections from localStorage
    function loadStoredSelections() {
      const storedSize = localStorage.getItem('selectedSize');
      const storedColor = localStorage.getItem('selectedColor');
      const storedQuantity = localStorage.getItem('selectedQuantity');

      if (storedSize && Array.from(sizeSelect.options).some(opt => opt.value === storedSize)) {
        sizeSelect.value = storedSize;
      }
      if (storedColor && Array.from(colorSelect.options).some(opt => opt.value === storedColor)) {
        colorSelect.value = storedColor;
        const selectedColorObj = product.variations.color.find(c => c.name === storedColor);
        if (selectedColorObj && selectedColorObj.available) {
          mainImage.src = selectedColorObj.image;
        }
      }
      if (storedQuantity && !isNaN(parseInt(storedQuantity, 10))) {
        const qty = parseInt(storedQuantity, 10);
        if (qty >= minQuantity && qty <= maxQuantity) {
          quantityInput.value = qty;
        }
      }
    }

    // Update total price
    function updateTotalPrice() {
      const quantity = parseInt(quantityInput.value, 10);
      const price = product.price;
      const total = (price * quantity).toFixed(2);
      totalPriceElement.textContent = `$${total}`;
    }

    // Store selections in localStorage
    function storeSelections() {
      localStorage.setItem('selectedSize', sizeSelect.value);
      localStorage.setItem('selectedColor', colorSelect.value);
      localStorage.setItem('selectedQuantity', quantityInput.value);
    }

    // Event listeners for variation and quantity changes
    colorSelect.addEventListener('change', () => {
      const selectedColor = product.variations.color.find(c => c.name === colorSelect.value);
      if (selectedColor && selectedColor.available) {
        mainImage.src = selectedColor.image;
      } else {
        mainImage.src = product.image;
      }
      updateTotalPrice();
      storeSelections();
    });

    sizeSelect.addEventListener('change', () => {
      storeSelections();
    });

    decreaseQtyBtn.addEventListener('click', () => {
      let currentQty = parseInt(quantityInput.value, 10);
      if (currentQty > minQuantity) {
        quantityInput.value = currentQty - 1;
        updateTotalPrice();
        storeSelections();
      }
    });

    increaseQtyBtn.addEventListener('click', () => {
      let currentQty = parseInt(quantityInput.value, 10);
      if (currentQty < maxQuantity) {
        quantityInput.value = currentQty + 1;
        updateTotalPrice();
        storeSelections();
      }
    });

    // Add to cart button event
    addToCartButton.addEventListener('click', () => {
      const selectedSize = sizeSelect.value;
      const selectedColor = colorSelect.value;
      const quantity = parseInt(quantityInput.value, 10);
      addToCart({ ...product, selectedSize, selectedColor, quantity });
    });

    // Load stored selections on page load
    loadStoredSelections();
    updateTotalPrice();

    // Show success message animation
    function showAddToCartMessage() {
      addToCartMessage.textContent = 'Added to Cart!';
      addToCartMessage.style.display = 'block';
      // Trigger reflow to restart animation
      void addToCartMessage.offsetWidth;
      addToCartMessage.classList.add('show');
      setTimeout(() => {
        addToCartMessage.classList.remove('show');
        addToCartMessage.style.display = 'none';
      }, 2000);
    }

    // Add to cart function
    function addToCart(product) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingProductIndex = cart.findIndex(p => p.id === product.id && p.selectedSize === product.selectedSize && p.selectedColor === product.selectedColor);
      if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + product.quantity;
      } else {
        cart.push(product);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      showAddToCartMessage();
    }

    // Update cart count
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const cartCountElement = document.getElementById('cart-count');
      if (cartCountElement) {
        cartCountElement.innerText = cart.reduce((total, p) => total + (p.quantity || 1), 0);
      }
    }
  }

  renderProductDetails(product);
  updateCartCount();

  // Image zoom functionality
  (function() {
    const mainImage = document.getElementById('product-main-image');
    if (!mainImage) return;

    // Desktop zoom elements
    let lens, result;
    let cx, cy;

    function createZoomElements() {
      lens = document.createElement('div');
      lens.setAttribute('class', 'img-zoom-lens');
      mainImage.parentElement.style.position = 'relative';
      mainImage.parentElement.appendChild(lens);

      result = document.createElement('div');
      result.setAttribute('class', 'img-zoom-result');
      mainImage.parentElement.appendChild(result);

      result.style.backgroundImage = `url('${mainImage.src}')`;

      cx = result.offsetWidth / lens.offsetWidth;
      cy = result.offsetHeight / lens.offsetHeight;
      result.style.backgroundSize = (mainImage.width * cx) + 'px ' + (mainImage.height * cy) + 'px';
    }

    function moveLens(e) {
      e.preventDefault();
      const pos = getCursorPos(e);
      let x = pos.x - lens.offsetWidth / 2;
      let y = pos.y - lens.offsetHeight / 2;

      if (x > mainImage.width - lens.offsetWidth) x = mainImage.width - lens.offsetWidth;
      if (x < 0) x = 0;
      if (y > mainImage.height - lens.offsetHeight) y = mainImage.height - lens.offsetHeight;
      if (y < 0) y = 0;

      lens.style.left = x + 'px';
      lens.style.top = y + 'px';
      result.style.backgroundPosition = '-' + (x * cx) + 'px -' + (y * cy) + 'px';
    }

    function getCursorPos(e) {
      const rect = mainImage.getBoundingClientRect();
      let x = e.pageX - rect.left - window.pageXOffset;
      let y = e.pageY - rect.top - window.pageYOffset;
      return { x, y };
    }

    function enableDesktopZoom() {
      createZoomElements();
      lens.style.visibility = 'visible';
      result.style.display = 'block';
      mainImage.addEventListener('mousemove', moveLens);

    }

    function disableDesktopZoom() {
      if (lens) lens.style.visibility = 'hidden';
      if (result) result.style.display = 'none';
      mainImage.removeEventListener('mousemove', moveLens);
      if (lens) lens.removeEventListener('mousemove', moveLens);
    }

    // Mobile tap-to-zoom toggle
    let zoomedIn = false;
    function toggleMobileZoom() {
      zoomedIn = !zoomedIn;
      if (zoomedIn) {
        mainImage.classList.add('zoomed-in');
      } else {
        mainImage.classList.remove('zoomed-in');
      }
    }
  
    // Detect if device is touch capable
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      mainImage.addEventListener('click', toggleMobileZoom);
    } else {
      mainImage.addEventListener('mouseenter', enableDesktopZoom);
      mainImage.addEventListener('mouseleave', disableDesktopZoom);
    }
        mainImage.addEventListener('touchstart', (e) => {
          e.preventDefault();
          if (zoomedIn) {
            toggleMobileZoom();
          } else {
            enableDesktopZoom();
          }
        });
      })(); // Close the IIFE for image zoom functionality
    }); // Close the DOMContentLoaded event listener
