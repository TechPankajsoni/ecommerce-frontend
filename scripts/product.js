document.addEventListener('DOMContentLoaded', function() {
  const productId = new URLSearchParams(window.location.search).get('id');
  const productDetail = document.getElementById('product-detail');

  if (!productId) {
    productDetail.innerHTML = '<p>No product selected. Please go back to the product list.</p>';
    return;
  }

  // Show loading state
  productDetail.innerHTML = '<div class="loading">Loading product details...</div>';

  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(response => {
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    })
    .then(product => {
      renderProductDetails(product);
    })
    .catch(error => {
      productDetail.innerHTML = `
        <div class="error">
          <p>Error loading product: ${error.message}</p>
          <a href="/" class="back-link">← Back to products</a>
        </div>
      `;
    });
// Sample product data (you can replace this with an API call)
const products = [
    { id: 1, name: "Product 1", price: "$10.00", description: "Description for Product 1", image: "image1.jpg" },
    { id: 2, name: "Product 2", price: "$20.00", description: "Description for Product 2", image: "image2.jpg" },
    // Add more products as needed
];

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to load product details
function loadProductDetails() {
    const productId = getUrlParameter('id');
    const product = products.find(p => p.id == productId);

    if (product) {
        document.getElementById('product-name').innerText = product.name;
        document.getElementById('product-price').innerText = product.price;
        document.getElementById('product-description').innerText = product.description;
        document.getElementById('main-image').src = product.image;
    } else {
        document.getElementById('product-detail').innerText = "Product not found.";
    }
}

// Function to add product to cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').innerText = cart.length;
}

// Event listener for "Add to Cart" button
document.getElementById('add-to-cart').addEventListener('click', () => {
    const productId = getUrlParameter('id');
    addToCart(productId);
});

// Load product details on page load
window.onload = () => {
    loadProductDetails();
    updateCartCount();
};

  function renderProductDetails(product) {
    productDetail.innerHTML = `
      <div class="product-container">
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-info">
          <h1>${product.title}</h1>
          <div class="price">$${product.price.toFixed(2)}</div>
          <div class="description">${product.description}</div>
          <div class="actions">
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    
    // Add event listener for the cart button
    document.querySelector('.add-to-cart').addEventListener('click', addToCart);
  }

  function addToCart() {
    // Your cart implementation here
    console.log('Added to cart');
  }
});
// Update your addToCart function in product.js
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProduct = cart.find(p => p.id === product.id);
  
  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count in header
  const cartCount = document.querySelector('.badge');
  if (cartCount) {
    cartCount.textContent = cart.reduce((total, p) => total + (p.quantity || 1), 0);
  }
  
  // Visual feedback
  const button = document.querySelector('.add-to-cart');
  button.textContent = 'Added to Cart!';
  setTimeout(() => {
    button.textContent = 'Add to Cart';
  }, 1500);
}
