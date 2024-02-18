require('dotenv').config()

module.exports = {
    port: 8080,
    dbUser: process.env.DB_USER,
    dbPassword:process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    ghClientId: process.env.GITHUB_CLIENT_ID,
    ghClientSecret: process.env.GITHUB_CLIENT_SECRET,
}
