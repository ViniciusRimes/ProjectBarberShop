const {DataTypes} = require('sequelize')
const conn = require('../db/conn')

const Scheduling = conn.define('Scheduling', {
    date: {
        type: DataTypes.DATEONLY,
    },
    time: {
        type: DataTypes.TIME,
    },
    available: {
        type: DataTypes.BOOLEAN
    }
})
const Client = require('./Client')
Client.hasMany(Scheduling)
module.exports = Scheduling