// VULNERABILITY: Hardcoded credentials in configuration
module.exports = {
  development: {
    host: 'localhost',
    port: 27017,
    database: 'vulnerable_app',
    username: 'admin',
    password: process.env.DB_PASSWORD,
    connectionString: 'mongodb://admin:password123@localhost:27017/vulnerable_app'
  },
  production: {
    host: 'prod-db.example.com',
    port: 27017,
    database: 'vulnerable_app_prod',
    username: 'produser',
    password: 'ProdP@ssw0rd!',  // Hardcoded production password
    apiKey: 'sk-1234567890abcdef'  // Hardcoded API key
  }
};
