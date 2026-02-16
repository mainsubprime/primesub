// Admin Login API - Authenticate admin user
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
        const { email, password } = JSON.parse(event.body);
        
        // Check admin credentials in database
        // In production, use hashed passwords
        const result = await query(
            'SELECT * FROM admins WHERE email = $1 AND password = $2',
            [email, password]
        );
        
        if (result.rows.length > 0) {
            const admin = result.rows[0];
            // Return admin info (in production, return a JWT token)
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    success: true,
                    admin: {
                        id: admin.id,
                        email: admin.email,
                        name: admin.name
                    }
                })
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid credentials' })
            };
        }
    } catch (error) {
        console.error('Error during login:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Login failed' })
        };
    }
};
