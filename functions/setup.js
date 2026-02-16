// Setup API - Initialize database tables
const { setupDatabase } = require('./init');

exports.handler = async (event, context) => {
    // Only allow GET requests for setup
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const result = await setupDatabase();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: true, message: 'Database setup completed!' })
        };
    } catch (error) {
        console.error('Setup error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Database setup failed', details: error.message })
        };
    }
};
