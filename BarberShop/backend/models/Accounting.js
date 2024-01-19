const {DataTypes} = require("sequelize")
const conn = require("../db/conn")

const Accounting = conn.define('Accounting',{
    monthYear: {
        type: DataTypes.DATEONLY
    },
    servicesProvided: {
        type: DataTypes.INTEGER
    },
    totalAmount: {
        type: DataTypes.FLOAT
    }
})
const BarberShop = require('./BarberShop')
Accounting.belongsTo(BarberShop)
module.exports = Accounting