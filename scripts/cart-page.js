
// Cart Page JavaScript
class CartPage {
    constructor() {
        this.cart = CartManager.getCart();
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderCart();
        this.updateSummary();
    }

    bindEvents() {
        // Continue shopping button
        document.getElementById('continue-shopping').addEventListener('click', () => {
            window.location.href = 'product.html';
        });

        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', () => {
            if (this.cart.length > 0) {
                window.location.href = 'checkout.html';
            }
        });

        // Hamburger menu for mobile
        const hamburger = document.querySelector('.hamburger-menu');
        const navbar = document.querySelector('.navbar');
        
        if (hamburger && navbar) {
            hamburger.addEventListener('click', () => {
                navbar.classList.toggle('active');
            });
        }
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="loading">Your cart is empty</p>';
            emptyCartMessage.style.display = 'block';
            checkoutBtn.disabled = true;
            return;
        }

        emptyCartMessage.style.display = 'none';
        checkoutBtn.disabled = false;

        cartItemsContainer.innerHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
        
        // Bind events for newly created elements
        this.bindCartItemEvents();
    }

    createCartItemHTML(item) {
        const price = parseFloat(item.price) || 0;
        const itemTotal = price * (item.quantity || 1);
        
        return `
            <div class="cart-item" data-cart-item-id="${item.cartItemId}">
                <img src="${item.image || '../assets/IMAGE/placeholder.jpg'}" 
                     alt="${item.name}" 
                     class="cart-item-image"
                     onclick="window.location.href='merged_product.html?id=${item.id}'"
                     style="cursor: pointer;">
                <div class="cart-item-details">
                    <h3 class="cart-item-name" 
                        onclick="window.location.href='merged_product.html?id=${item.id}'"
                        style="cursor: pointer; color: #007bff; text-decoration: underline;">
                        ${item.name}
                    </h3>
                    <p class="cart-item-options">
                        Size: ${item.selectedSize || 'N/A'} | 
                        Color: ${item.selectedColor || 'N/A'}
                    </p>
                    <p class="cart-item-price">$${price.toFixed(2)} each</p>
                    <button class="view-product-btn" 
                            onclick="window.location.href='merged_product.html?id=${item.id}'"
                            style="margin-top: 8px; padding: 4px 8px; font-size: 12px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        View Product
                    </button>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn decrease-qty" 
                                data-id="${item.cartItemId}" 
                                ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <input type="text" 
                               class="quantity-input" 
                               value="${item.quantity || 1}" 
                               readonly>
                        <button class="quantity-btn increase-qty" 
                                data-id="${item.cartItemId}">+</button>
                    </div>
                    <button class="remove-btn" 
                            data-id="${item.cartItemId}">Remove</button>
                </div>
            </div>
        `;
    }

    bindCartItemEvents() {
        // Quantity increase
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItemId = e.target.dataset.id;
                this.updateQuantity(cartItemId, 1);
            });
        });

        // Quantity decrease
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItemId = e.target.dataset.id;
                this.updateQuantity(cartItemId, -1);
            });
        });

        // Remove item
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItemId = e.target.dataset.id;
                this.removeItem(cartItemId);
            });
        });
    }

    updateQuantity(cartItemId, change) {
        console.log(`Updating quantity for item ID: ${cartItemId}, change: ${change}`);
        const itemIndex = this.cart.findIndex(item => item.cartItemId === cartItemId);
        console.log(`Current cart state before update:`, this.cart);
        console.log(`Current quantity before update: ${item.quantity}`);
        console.log(`Item index found: ${itemIndex}, Current quantity: ${item.quantity}`);
        
        if (itemIndex === -1) return;

        const item = this.cart[itemIndex];
        const newQuantity = Math.max(1, (item.quantity || 1) + change);
        
        if (newQuantity !== item.quantity) {
            this.cart[itemIndex].quantity = newQuantity;
            CartManager.saveCart(this.cart);
            
            // Update UI
            const quantityInput = document.querySelector(
                `.cart-item[data-cart-item-id="${cartItemId}"] .quantity-input`
            );
            const decreaseBtn = document.querySelector(
                `.cart-item[data-cart-item-id="${cartItemId}"] .decrease-qty`
            );
            
            if (quantityInput) {
                quantityInput.value = newQuantity;
            }
            
            if (decreaseBtn) {
                decreaseBtn.disabled = newQuantity <= 1;
            }
            
            this.updateSummary();
            this.addUpdateAnimation(cartItemId);
        }
    }

    removeItem(cartItemId) {
        const itemElement = document.querySelector(`[data-cart-item-id="${cartItemId}"]`);
        
        if (itemElement) {
            itemElement.classList.add('removing');
            
            setTimeout(() => {
                this.cart = this.cart.filter(item => item.cartItemId !== cartItemId);
                CartManager.saveCart(this.cart);
                this.renderCart();
                this.updateSummary();
            }, 300);
        }
    }

    updateSummary() {
        const subtotal = this.cart.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            return total + (price * (item.quantity || 1));
        }, 0);

        const shipping = 5.00;
        const total = subtotal + shipping;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    addUpdateAnimation(cartItemId) {
        const itemElement = document.querySelector(`[data-cart-item-id="${cartItemId}"]`);
        if (itemElement) {
            itemElement.classList.add('cart-item-updating');
            setTimeout(() => {
                itemElement.classList.remove('cart-item-updating');
            }, 300);
        }
    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartPage();
});

// Handle browser back/forward navigation
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was loaded from cache, refresh cart
        window.location.reload();
    }
});
