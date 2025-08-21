// Enhanced Cart Manager with Real-time Updates
const CartManager = {
  getCart: () => JSON.parse(localStorage.getItem('cart')) || [],
  
  saveCart: (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
    CartManager.updateCartCount();
  },
  
  addToCart: (product, size, color, quantity) => {
    let cart = CartManager.getCart();
    const cartItemId = `${product.id}-${size}-${color}`;
    
    console.log('Adding to cart:', product, size, color, quantity);
    console.log('Current cart before adding:', cart);
    console.log('Cart item ID:', cartItemId);
    
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
      console.log('Updated existing item:', cart[existingItemIndex]);
    } else {
      cart.push(cartItem);
      console.log('Added new item:', cartItem);
    }
    
    CartManager.saveCart(cart);
    console.log('Cart after adding:', cart);
    return cart;
  },
  
  updateCartCount: () => {
    const cart = CartManager.getCart();
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
      if (element) {
        element.textContent = totalItems;
        element.classList.add('cart-count-update');
        setTimeout(() => {
          element.classList.remove('cart-count-update');
        }, 600);
      }
    });
    
    const cartIcons = document.querySelectorAll('.cart-icon, .shopping-cart');
    cartIcons.forEach(icon => {
      icon.classList.add('cart-bounce');
      setTimeout(() => {
        icon.classList.remove('cart-bounce');
      }, 600);
    });
    
    const cartLinks = document.querySelectorAll('a[href*="cart"]');
    cartLinks.forEach(link => {
      const text = link.textContent;
      const updatedText = text.replace(/\(\d+\)/, `(${totalItems})`);
      if (updatedText !== link.textContent) {
        link.textContent = updatedText;
      }
    });
  },
  
  clearCart: () => {
    localStorage.removeItem('cart');
    CartManager.updateCartCount();
  }
};

// Initialize cart count on all pages
document.addEventListener('DOMContentLoaded', function() {
  CartManager.updateCartCount();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CartManager;
}
