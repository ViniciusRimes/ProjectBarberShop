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
        references: {
            model: Client,
            key: 'id',
        },
        allowNull: false
    },
    SchedulingId: {
        type: DataTypes.INTEGER,
        references: {
            model: Scheduling,
            key: 'id',
        },
        allowNull: false
    },
    ServiceId: {
        type: DataTypes.INTEGER,
        references: {
            model: Services,
            key: 'id',
        },
        allowNull: false
    },
    finished: {
        type: DataTypes.BOOLEAN
    }
})

/*
Client.belongsToMany(Scheduling, { through: {model: SchedulingEvent, unique: false}});
Scheduling.belongsToMany(Client, { through: {model: SchedulingEvent, unique: false}});
Services.belongsToMany(Client, { through: {model: SchedulingEvent, unique: false}});
Services.belongsToMany(Scheduling, { through: {model: SchedulingEvent, unique: false}});*/

module.exports = SchedulingEvent