let allProducts = [];

document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger-menu');
  const navbar = document.querySelector('.navbar');

  if (hamburger && navbar) {
    hamburger.addEventListener('click', function() {
      navbar.classList.toggle('active');
    });
  }

  const productGrid = document.getElementById('product-grid');

  // Add as many custom products as you like here
  const customProducts = [
    {
      id: 101,
      title: "Custom Pankaj Chain",
      price: 25.33,
      description: "Beautiful custom chain crafted with care.",
      image: "https://example.com/image1.jpg",
      category: "jewelery"
    },
    {
      id: 102,
      title: "Custom Wrist Watch",
      price: 55.00,
      description: "Elegant wrist watch for all occasions.",
      image: "https://example.com/image2.jpg",
      category: "accessories"
    },
    {
      id: 103,
      title: "Custom Headphones",
      price: 89.99,
      description: "Noise cancelling over-ear headphones.",
      image: "https://example.com/image3.jpg",
      category: "electronics"
    }
    // Add more custom products here
  ];

  fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(apiProducts => {
      // Combine API products with your custom products
      allProducts = [...customProducts, ...apiProducts];

      allProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.setAttribute('data-id', product.id);
        productCard.innerHTML = `
          <div class="product-card-content">
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
            <h3>${product.title}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button class="add-to-cart">Add to Cart</button>
          </div>
        `;

        // Add click event to the content wrapper, not the whole card
        productCard.querySelector('.product-card-content').addEventListener('click', (e) => {
          if (!e.target.classList.contains('add-to-cart')) {
            window.location.href = `product.html?id=${product.id}`;
          }
        });

        productGrid.appendChild(productCard);
      });
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      // Fallback: render only custom products if API fails
      customProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
          <div class="product-card-content">
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
            <h3>${product.title}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button class="add-to-cart">Add to Cart</button>
          </div>
        `;

        productCard.querySelector('.product-card-content').addEventListener('click', (e) => {
          if (!e.target.classList.contains('add-to-cart')) {
            window.location.href = `product.html?id=${product.id}`;
          }
        });

        productGrid.appendChild(productCard);
      });
    });

  // Add event listener for add-to-cart buttons using event delegation
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      e.preventDefault();
      e.stopPropagation();
      const productCard = e.target.closest('.product-card');
      const productId = productCard ? productCard.getAttribute('data-id') : null;
      const product = allProducts.find(p => p.id.toString() === productId);
      if (product) {
        addToCart(product);
      } else {
        console.error('Product not found for ID:', productId);
      }
    }
  });

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      cartCountElement.innerText = cart.reduce((total, p) => total + (p.quantity || 1), 0);
    }
  }

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
    updateCartCount();
  }
});
