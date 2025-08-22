document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalSpan = document.getElementById('cart-subtotal');
  const cartTotalSpan = document.getElementById('cart-total');
  const cartCountElement = document.querySelector('.cart-count');
  const whatsappForm = document.getElementById('whatsapp-form');

  const popup = document.getElementById('payment-popup');
  const closePopupBtn = document.querySelector('.close-popup');
  const mpesaBtn = document.getElementById('mpesa-btn');
  const mpesaInstructions = document.getElementById('mpesa-instructions');
  const mpesaAmountElement = document.getElementById('mpesa-amount');
  const paypalButton = document.querySelector('.btn-paypal');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // 🔑 Set your exchange rate here (KES → USD)
  const exchangeRateKEStoUSD = 160; // example: 1 USD ≈ 160 KES

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

  // Show popup
  function showPaymentPopup() {
    popup.classList.remove('hidden');
  }

  if (whatsappForm) {
    whatsappForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const city = document.getElementById('city').value;
      const paymentMethod = document.getElementById('payment-method').value;

      let orderMessage = `Hello Cloud 9 👋,\nI would like to confirm availability for the following items:\n\n`;
      cart.forEach(item => {
        orderMessage += `• ${item.name} (x${item.quantity}) - Ksh ${item.price * item.quantity}\n`;
      });

      const totalKES = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      orderMessage += `\nSubtotal: Ksh ${totalKES}\n\n`;
      orderMessage += `Customer Details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city}\n`;
      orderMessage += `Preferred Payment Method: ${paymentMethod === "mpesa" ? "M-Pesa" : "PayPal"}\n\n`;
      orderMessage += `Please confirm if these items are available ✅`;

      const phoneNumber = "254111969099"; // your WhatsApp number
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderMessage)}`;

      // Redirect to WhatsApp
      window.open(whatsappURL, "_blank");

      // Build popup order summary
      let summaryHTML = "<h4>Your Order</h4><ul>";
      cart.forEach(item => {
        summaryHTML += `<li>${item.name} (x${item.quantity}) - Ksh ${item.price * item.quantity}</li>`;
      });
      summaryHTML += `</ul>
      <p><strong>Total:</strong> Ksh ${totalKES}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Payment Method:</strong> ${paymentMethod === "mpesa" ? "M-Pesa" : "PayPal"}</p>`;

      document.getElementById("popup-order-summary").innerHTML = summaryHTML;

      // ✅ Update M-Pesa instructions with total (KES)
      if (mpesaAmountElement) {
        mpesaAmountElement.textContent = `Ksh ${totalKES}`;
      }

      // ✅ Update PayPal link with USD conversion
      if (paypalButton) {
        const totalUSD = (totalKES / exchangeRateKEStoUSD).toFixed(2);
        paypalButton.href = `https://www.paypal.me/YourBusinessName/${totalUSD}USD`;
      }

      // Show payment popup
      showPaymentPopup();
    });
  }

  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', () => {
      popup.classList.add('hidden');
    });
  }

  if (mpesaBtn) {
    mpesaBtn.addEventListener('click', () => {
      mpesaInstructions.classList.toggle('hidden');
    });
  }

  renderCart();
});
