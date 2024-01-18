const {DataTypes} = require('sequelize')
const conn = require('../db/conn')
const Client = require('./Client')
const Scheduling = require('./Scheduling')
const Services = require('./Services')

const SchedulingEvent = conn.define('SchedulingEvent',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ClientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    SchedulingId: {
        type: DataTypes.INTEGER,
        references: {
            model: Scheduling,
            key: 'id',
        },
        allowNull: false,
    },
    ServiceId: {
        type: DataTypes.INTEGER,
        references: {
            model: Services,
            key: 'id',
        },
        allowNull: false,
    },
})

Client.belongsToMany(Scheduling, { through: SchedulingEvent });
Scheduling.belongsToMany(Client, { through: SchedulingEvent });
Services.belongsToMany(Client, { through: SchedulingEvent });
Services.belongsToMany(Scheduling, { through: SchedulingEvent });

module.exports = SchedulingEvent