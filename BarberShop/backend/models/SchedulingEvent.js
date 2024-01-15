const {DataTypes} = require('sequelize')
const conn = require('../db/conn')

const SchedulingEvent = conn.define('SchedulingEvent',{

})

const Client = require('./Client')
const Scheduling = require('./Scheduling')
Client.belongsToMany(Scheduling, {through: SchedulingEvent})
Scheduling.belongsToMany(Client, {through: SchedulingEvent})
module.exports = SchedulingEvent