const { validationResult } = require('express-validator')
const Services = require('../models/Services')
const { Op } = require('sequelize')

module.exports = class ServicesController{
    static async createService(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({message: {errors: errors.array()}})
                return
            }
            const {name, duration, value} = req.body
            const serviceExists = await Services.findOne({
                where: {
                    name: {
                        [Op.like]: name
                    }
                }
            })
            if(serviceExists){
                res.status(400).json({message: "Serviço já cadastrado, edite-o ou apague para cadastrar novamente!"})
                return
            }
            const newService = {name, duration, value}
            await Services.create(newService)
            res.status(201).json({message: "Serviço cadastrado!"})
        }catch(error){
            res.status(400).json({message: "Erro: " + error})
        }
    }
    static async deleteService(req, res){
        try{
            const serviceId = req.params.serviceId
            const serviceExists = await Services.findOne({where: {id: serviceId}})
            if(!serviceExists){
                res.status(400).json({message: "Serviço não encontrado!"})
                return
            }
            await Services.destroy({where: {id: serviceExists.id}})
            res.status(201).json({message: "Serviço deletado!"})
        }catch(error){
            res.status(400).json({message: "Erro: " + error})
        }   
    }
    static async editService(req, res){
        try{
            const serviceId = req.params.serviceId
            const serviceExists = await Services.findOne({where: {id: serviceId}})
            if(!serviceExists){
                res.status(400).json({message: "Serviço não encontrado!"})
                return
            }
            const {name, duration, value} = req.body

            await Services.update({
                name: name || serviceExists.name, duration: duration || serviceExists.duration, value: value || serviceExists.value
            }, {where: {id: serviceExists.id}})
           
            res.status(201).json({message: "Serviço editado!"})
        }catch(error){
            res.status(400).json({message: "Erro: " + error})
        }   
    }
    static async getServices(req, res) {
        try{
            const servicesInDb = await Services.findAll()
            const services = []
            for(let item of servicesInDb){
                const newService = {
                    id: item.id,
                    name: item.name,
                    value: item.value,
                    duration: item.duration
                }
                services.push(newService)
            }
            await res.status(200).send(services)
        }catch(error){
            res.status(400).json({message: "Erro: " + error})
        }
    }
}