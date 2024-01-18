const {DataTypes} = require('sequelize')
const conn = require('../db/conn')

const Services = conn.define("Services", {
    name: {
        type: DataTypes.STRING
    },
    duration: {
        type: DataTypes.INTEGER
    },
    value: {
        type: DataTypes.FLOAT
    }
})
module.exports = Services
