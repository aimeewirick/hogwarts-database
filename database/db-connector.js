// Get instance of mysql we can use in app
var mysql = require('mysql')

// Create a 'connection pool' using provided credentials
// Credentials are loaded from environment variables for security
// Copy .env.example to .env and fill in your database credentials
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// Export it for use in our application
module.exports.pool = pool;
