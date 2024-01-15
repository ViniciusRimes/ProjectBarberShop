const {DataTypes} = require('sequelize')
const conn = require('../db/conn')

const Client = conn.define('Client', {
    name: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    img: {
        type: DataTypes.STRING
    }
})
module.exports = Client