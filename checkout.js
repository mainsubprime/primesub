// ============================================
// Checkout Page JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Load Cart from localStorage
    // ============================================
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // ============================================
    // Display Cart Items in Summary
    // ============================================
    const summaryItems = document.getElementById('summaryItems');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    function updateOrderSummary() {
        if (cart.length === 0) {
            summaryItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
            subtotalEl.textContent = '$0.00';
            shippingEl.textContent = '$0.00';
            taxEl.textContent = '$0.00';
            totalEl.textContent = '$0.00';
            return;
        }
        
        let subtotal = 0;
        let itemsHTML = '';
        
        cart.forEach(item => {
            subtotal += item.price;
            itemsHTML += `
                <div class="summary-item">
                    <div class="summary-item-info">
                        <h4>${item.name}</h4>
                        <p>Qty: 1</p>
                    </div>
                    <span class="summary-item-price">$${item.price.toFixed(2)}</span>
                </div>
            `;
        });
        
        summaryItems.innerHTML = itemsHTML;
        
        // Calculate totals
        const shipping = subtotal > 50 ? 0 : 5; // Free shipping over $50
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;
        
        subtotalEl.textContent = '$' + subtotal.toFixed(2);
        shippingEl.textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
        taxEl.textContent = '$' + tax.toFixed(2);
        totalEl.textContent = '$' + total.toFixed(2);
        
        // Store totals for order
        localStorage.setItem('subtotal', subtotal.toFixed(2));
        localStorage.setItem('shipping', shipping.toFixed(2));
        localStorage.setItem('tax', tax.toFixed(2));
        localStorage.setItem('total', total.toFixed(2));
    }
    
    updateOrderSummary();
    
    // ============================================
    // Payment Method Toggle
    // ============================================
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById('cardDetails');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'visa') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });
    
    // ============================================
    // Card Number Formatting
    // ============================================
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // ============================================
    // Expiry Date Formatting
    // ============================================
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            e.target.value = value;
        });
    }
    
    // ============================================
    // Place Order
    // ============================================
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate form
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            const zip = document.getElementById('zip').value;
            const country = document.getElementById('country').value;
            
            if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zip || !country) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Get payment method
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            // Validate card details if visa is selected
            if (paymentMethod === 'visa') {
                const cardNumber = document.getElementById('cardNumber').value;
                const cardExpiry = document.getElementById('cardExpiry').value;
                const cardCVV = document.getElementById('cardCVV').value;
                const cardName = document.getElementById('cardName').value;
                
                if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
                    alert('Please fill in all card details.');
                    return;
                }
            }
            
            // Generate order number
            const orderNumber = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
            const orderDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Create order object
            const order = {
                orderId: orderNumber,
                date: orderDate,
                customer: {
                    name: firstName + ' ' + lastName,
                    email: email,
                    phone: phone,
                    address: address + ', ' + city + ', ' + state + ' ' + zip + ', ' + country
                },
                items: cart,
                subtotal: parseFloat(localStorage.getItem('subtotal') || '0'),
                shipping: parseFloat(localStorage.getItem('shipping') || '0'),
                tax: parseFloat(localStorage.getItem('tax') || '0'),
                total: parseFloat(localStorage.getItem('total') || '0'),
                paymentMethod: paymentMethod === 'cash' ? 'Cash on Delivery' : 'Credit/Debit Card',
                status: 'Pending',
                notes: document.getElementById('orderNotes')?.value || ''
            };
            
            // Get existing orders or create new array
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update order number in modal
            document.getElementById('orderNumber').textContent = orderNumber;
            
            // Show success modal
            const modal = document.getElementById('successModal');
            modal.classList.add('active');
            
            // Update admin dashboard notification
            updateAdminNotifications();
        });
    }
    
    // ============================================
    // Update Admin Notifications
    // ============================================
    function updateAdminNotifications() {
        // Store notification that admin can check
        localStorage.setItem('newOrder', 'true');
        localStorage.setItem('lastOrderTime', new Date().toISOString());
    }
    
    // ============================================
    // Modal Close
    // ============================================
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                // Don't close on click - let user click the button
            }
        });
    }

    // ============================================
    // Console Message
    // ============================================
    console.log('%c Checkout Page Loaded ', 'background: #d4af37; color: #1a1a1a; font-size: 20px; padding: 10px; border-radius: 5px;');

});
