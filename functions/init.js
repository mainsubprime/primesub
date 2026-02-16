// Database Setup - Create tables
const { query, getClient } = require('./db');

async function setupDatabase() {
    try {
        // Create admins table
        await query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('Admins table created successfully');

        // Create orders table
        await query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                order_number VARCHAR(50) UNIQUE NOT NULL,
                customer_name VARCHAR(255) NOT NULL,
                customer_email VARCHAR(255) NOT NULL,
                customer_phone VARCHAR(50) NOT NULL,
                shipping_address TEXT NOT NULL,
                items JSONB NOT NULL,
                subtotal DECIMAL(10, 2) NOT NULL,
                shipping DECIMAL(10, 2) NOT NULL,
                tax DECIMAL(10, 2) NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                payment_method VARCHAR(50) NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                notes TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('Orders table created successfully');

        // Create products table
        await query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                category VARCHAR(100),
                stock INT DEFAULT 0,
                image VARCHAR(500),
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('Products table created successfully');

        // Insert default admin user
        // Email: primeadmin.ph.primn, Password: admin123
        await query(`
            INSERT INTO admins (email, password, name)
            VALUES ('primeadmin.ph.primn', 'admin123', 'Admin')
            ON CONFLICT (email) DO NOTHING
        `);
        console.log('Default admin user created');

        // Insert sample products
        await query(`
            INSERT INTO products (name, description, price, category, stock) VALUES
            ('Hair Serum', 'Deep conditioning serum for shiny, healthy hair', 29.99, 'Hair Care', 50),
            ('Shampoo', 'Gentle cleansing formula for all hair types', 19.99, 'Hair Care', 45),
            ('Hair Mask', 'Intensive treatment for damaged hair', 34.99, 'Hair Care', 30),
            ('Hair Oil', 'Essential oils for hair growth and nourishment', 24.99, 'Hair Care', 40),
            ('Hair Spray', 'Light hold spray for natural-looking style', 15.99, 'Styling', 60),
            ('Leave-In Conditioner', 'Daily moisture for soft, manageable hair', 22.99, 'Hair Care', 35)
            ON CONFLICT DO NOTHING
        `);
        console.log('Sample products inserted');

        console.log('Database setup completed successfully!');
        return { success: true };
    } catch (error) {
        console.error('Error setting up database:', error);
        throw error;
    }
}

// Export for use in other functions
module.exports = { setupDatabase };
