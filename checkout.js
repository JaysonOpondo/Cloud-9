document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalSpan = document.getElementById('cart-subtotal');
  const cartTotalSpan = document.getElementById('cart-total');
  const cartCountElement = document.querySelector('.cart-count');
  const whatsappForm = document.getElementById('whatsapp-form');
  const clearCartBtn = document.getElementById('clear-cart');

  let cart;
  try {
    const raw = localStorage.getItem('cart');
    const parsed = raw ? JSON.parse(raw) : null;
    cart = Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse cart from localStorage', e);
    cart = [];
  }

  function updateCartCount() {
    if (cartCountElement) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCountElement.textContent = totalItems;
    }
  }

  function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
      cartSubtotalSpan.textContent = 'Ksh 0';
      cartTotalSpan.textContent = 'Ksh 0';
      updateCartCount();
      return;
    }

    cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Ksh ${item.price.toLocaleString()}</p>
        </div>
        <div class="cart-item-quantity">
          <input type="number" min="1" value="${item.quantity}" data-index="${index}">
          <button class="remove-item" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    attachQuantityListeners();
    attachRemoveListeners();
    updateTotals();
  }

  function updateTotals() {
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    cartSubtotalSpan.textContent = `Ksh ${subtotal.toLocaleString()}`;
    cartTotalSpan.textContent = `Ksh ${subtotal.toLocaleString()}`;

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }

  function attachQuantityListeners() {
    const quantityInputs = document.querySelectorAll('.cart-item-quantity input');
    quantityInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const index = e.target.dataset.index;
        const newQty = parseInt(e.target.value);
        if (isNaN(newQty) || newQty < 1) {
          e.target.value = cart[index].quantity;
          return;
        }
        cart[index].quantity = newQty;
        updateTotals();
      });
    });
  }

  function attachRemoveListeners() {
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = button.dataset.index;
        cart.splice(index, 1);
        renderCart();
      });
    });
  }

  // Clear cart manually
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      }
    });
  }

  // WhatsApp order
  if (whatsappForm) {
    whatsappForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const city = document.getElementById('city').value;

      let orderMessage = `Hello Cloud 9 👋,\nI would like to order the following items:\n\n`;
      cart.forEach(item => {
        orderMessage += `• ${item.name} (x${item.quantity}) - Ksh ${item.price * item.quantity}\n`;
      });

      const totalKES = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      orderMessage += `\nTotal: Ksh ${totalKES}\n\n`;
      orderMessage += `Customer Details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city}\n`;

      const phoneNumber = "254111969099"; // your WhatsApp number
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderMessage)}`;

      // Redirect to WhatsApp
      window.open(whatsappURL, "_blank");
    });
  }

  renderCart();
});
