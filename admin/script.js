// ============================================
// Admin Dashboard JavaScript - API Version
// ============================================

const API_BASE = '/.netlify/functions';

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Login Functionality - Using API
    // ============================================
    const loginForm = document.getElementById('loginForm');
    const loginPage = document.getElementById('loginPage');
    const dashboardPage = document.getElementById('dashboardPage');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (email && password) {
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
                
                try {
                    // Call login API
                    const response = await fetch('/.netlify/functions/admin-login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password })
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok && data.success) {
                        // Hide login page, show dashboard
                        loginPage.style.display = 'none';
                        dashboardPage.style.display = 'flex';
                        
                        // Save login state to localStorage
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('adminEmail', email);
                        
                        // Load orders from database
                        loadOrders();
                    } else {
                        alert(data.error || 'Invalid credentials');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    alert('Login failed. Please try again.');
                }
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Login';
            }
        });
    }
    
    // Check if already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        if (loginPage && dashboardPage) {
            loginPage.style.display = 'none';
            dashboardPage.style.display = 'flex';
            // Load orders from database
            loadOrders();
        }
    }
    
    // ============================================
    // Load Orders from Database API
    // ============================================
    async function loadOrders() {
        const ordersTableBody = document.querySelector('#ordersPage .data-table tbody');
        if (!ordersTableBody) return;
        
        try {
            const response = await fetch('/.netlify/functions/orders');
            const orders = await response.json();
            
            if (orders.length > 0) {
                let html = '';
                orders.forEach(order => {
                    const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
                    const itemCount = items.length;
                    
                    html += `
                        <tr>
                            <td>${order.order_number || 'N/A'}</td>
                            <td>${order.customer_name}</td>
                            <td>${order.customer_email}</td>
                            <td>$${parseFloat(order.total_amount).toFixed(2)}</td>
                            <td><span class="status status-${order.status.toLowerCase()}">${order.status}</span></td>
                            <td>${new Date(order.created_at).toLocaleDateString()}</td>
                            <td>
                                <div class="table-actions">
                                    <button class="btn-action" onclick="viewOrder(${order.id})" title="View">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-action" onclick="updateOrderStatus(${order.id}, 'Approved')" title="Approve">
                                        <i class="fas fa-check"></i>
                                    </button>
                                    <button class="btn-action" onclick="updateOrderStatus(${order.id}, 'Rejected')" title="Reject">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                });
                ordersTableBody.innerHTML = html;
            } else {
                ordersTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No orders found</td></tr>';
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            // Fallback to localStorage
            loadOrdersFromLocalStorage();
        }
    }
    
    // Fallback to localStorage if API fails
    function loadOrdersFromLocalStorage() {
        const ordersTableBody = document.querySelector('#ordersPage .data-table tbody');
        if (!ordersTableBody) return;
        
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        if (orders.length > 0) {
            let html = '';
            orders.forEach((order, index) => {
                html += `
                    <tr>
                        <td>${order.orderId || 'N/A'}</td>
                        <td>${order.customer?.name || 'N/A'}</td>
                        <td>${order.customer?.email || 'N/A'}</td>
                        <td>$${order.total?.toFixed(2) || '0.00'}</td>
                        <td><span class="status status-pending">${order.status || 'Pending'}</span></td>
                        <td>${order.date || new Date().toLocaleDateString()}</td>
                        <td>
                            <div class="table-actions">
                                <button class="btn-action" onclick="viewOrder(${index})" title="View">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            ordersTableBody.innerHTML = html;
        } else {
            ordersTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No orders found</td></tr>';
        }
    }
    
    // Make updateOrderStatus available globally
    window.updateOrderStatus = async function(orderId, status) {
        try {
            const response = await fetch('/.netlify/functions/update-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, status })
            });
            
            if (response.ok) {
                alert(`Order ${status} successfully!`);
                loadOrders(); // Reload orders
            } else {
                alert('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order. Please try again.');
        }
    };
    
    // Make viewOrder available globally
    window.viewOrder = function(orderId) {
        alert('Order details for ID: ' + orderId);
    };
    
    // ============================================
    // Logout Functionality
    // ============================================
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear login state
            localStorage.removeItem('isLoggedIn');
            
            // Show login page, hide dashboard
            if (loginPage && dashboardPage) {
                dashboardPage.style.display = 'none';
                loginPage.style.display = 'flex';
            }
        });
    }
    
    // ============================================
    // Navigation Functionality
    // ============================================
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pageContents = document.querySelectorAll('.page-content');
    const pageTitle = document.getElementById('pageTitle');
    
    const pageTitles = {
        'orders': 'Orders',
        'feedback': 'Email Feedback',
        'products': 'Products',
        'customers': 'Customers',
        'settings': 'Settings'
    };
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const page = this.getAttribute('data-page');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update page title
            if (pageTitle && pageTitles[page]) {
                pageTitle.textContent = pageTitles[page];
            }
            
            // Show corresponding page content
            pageContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const targetPage = document.getElementById(page + 'Page');
            if (targetPage) {
                targetPage.classList.add('active');
            }
        });
    });
    
    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // ============================================
    // Search Functionality
    // ============================================
    const searchInputs = document.querySelectorAll('.search-box input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.table-container').querySelector('.data-table');
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
    
    // ============================================
    // Status Filter
    // ============================================
    const statusSelects = document.querySelectorAll('.table-actions select, .table-header select');
    statusSelects.forEach(select => {
        select.addEventListener('change', function() {
            const status = this.value.toLowerCase();
            const table = this.closest('.table-container').querySelector('.data-table');
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const statusBadge = row.querySelector('.status');
                if (statusBadge) {
                    const rowStatus = statusBadge.textContent.toLowerCase();
                    if (status === 'all status' || status === 'all' || rowStatus.includes(status)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // ============================================
    // Action Buttons
    // ============================================
    const actionButtons = document.querySelectorAll('.btn-action');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('fa-eye')) {
                console.log('View details');
            } else if (icon.classList.contains('fa-edit')) {
                console.log('Edit item');
            } else if (icon.classList.contains('fa-trash')) {
                if (confirm('Are you sure you want to delete this item?')) {
                    const row = this.closest('tr');
                    row.remove();
                }
            } else if (icon.classList.contains('fa-reply')) {
                console.log('Reply to message');
            }
        });
    });
    
    // ============================================
    // Export Button
    // ============================================
    const exportBtn = document.querySelector('.btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            const table = this.closest('.table-container').querySelector('.data-table');
            const rows = Array.from(table.querySelectorAll('tr'));
            
            const csv = rows.map(row => {
                const cells = Array.from(row.querySelectorAll('th, td'));
                return cells.map(cell => cell.textContent.trim()).join(',');
            }).join('\n');
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'export.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }
    
    // ============================================
    // Add Product Button
    // ============================================
    const addProductBtn = document.querySelector('.btn-add');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            alert('Add product modal would open here');
        });
    }
    
    // ============================================
    // Settings Form
    // ============================================
    const settingsForms = document.querySelectorAll('.settings-form');
    settingsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Settings saved successfully!');
        });
    });
    
    // ============================================
    // Console Welcome Message
    // ============================================
    console.log('%c Welcome to Prime Hair Admin Dashboard! ', 'background: #d4af37; color: #1a1a1a; font-size: 20px; padding: 10px; border-radius: 5px;');
    console.log('%c Manage your store with ease! ', 'background: #1a1a1a; color: #d4af37; font-size: 14px; padding: 5px;');

});
