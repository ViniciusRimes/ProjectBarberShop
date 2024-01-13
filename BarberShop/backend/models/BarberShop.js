const {DataTypes} = require("sequelize")
const conn = require("../db/conn")

const BarberShop = conn.define('BarberShop', {
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    proprietary: {
        type: DataTypes.STRING
    },
    cnpj: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    zipcode: {
        type: DataTypes.STRING
    },
})

module.exports = BarberShop