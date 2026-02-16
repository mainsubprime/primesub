// Create Order API - Create a new order
const { query } = require('./db');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const order = JSON.parse(event.body);
        
        // Insert order into database
        const result = await query(
            `INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, items, total_amount, payment_method, status, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
             RETURNING *`,
            [
                order.customer.name,
                order.customer.email,
                order.customer.phone,
                order.customer.address,
                JSON.stringify(order.items),
                order.total,
                order.paymentMethod,
                'Pending'
            ]
        );
        
        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result.rows[0])
        };
    } catch (error) {
        console.error('Error creating order:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create order' })
        };
    }
};
