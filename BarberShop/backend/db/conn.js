const {Sequelize} = require("sequelize")
require("dotenv").config()

const conn = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        connectTimeout: 60000,
    }
})
module.exports = conn