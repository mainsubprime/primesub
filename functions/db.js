// Neon Database Connection
// This file handles the connection to Neon PostgreSQL database

const { Client } = require('pg');

// Database connection configuration - Neon PostgreSQL
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_4ci1rRlTsCAN@ep-autumn-sound-aeszh0l4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

let client = null;

async function getClient() {
    if (!client) {
        client = new Client({
            connectionString: connectionString,
            ssl: {
                rejectUnauthorized: false
            }
        });
        await client.connect();
    }
    return client;
}

async function query(text, params) {
    const client = await getClient();
    try {
        const result = await client.query(text, params);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

module.exports = {
    query,
    getClient
};
