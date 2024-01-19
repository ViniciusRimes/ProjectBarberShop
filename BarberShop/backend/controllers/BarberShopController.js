const BarberShop = require('../models/BarberShop')
const {validationResult} = require('express-validator')
const generateCnpj = require('../helpers/GenerationCnpj')
const bcryptjs = require('bcryptjs')
const createToken = require('../Autheticate/createToken')
const getBarberShop = require('../Autheticate/getBarberShop')
const Client = require('../models/Client')
const SchedulingEvent = require("../models/SchedulingEvent")
const {format} = require("date-fns")
const Scheduling = require('../models/Scheduling')

module.exports = class BarberShopController{
    static async register(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({message: {errors: errors.array()}})
                return
            }
            const {name, email, password, confirmPassword, proprietary, phone, state, city, zipcode, cnpj} = req.body
            let cnpjGenerate 
            if(cnpj){
                if(cnpj.length != 14){
                    res.status(400).json({
                        message: "Cnpj inválido!",
                        errors: [{ param: 'cnpj', msg: 'O cnpj deve conter exatamente 14 dígitos!' }]
                    })
                    return
                }
                cnpjGenerate = cnpj
            }else{
                cnpjGenerate = generateCnpj()
            }
            const emailExists = await BarberShop.findOne({where: {email: email}})
            if(emailExists){
                res.status(400).json({message: "E-mail já cadastrado, faça login ou crie outra conta com um e-mail diferente!"})
                return
            }
            if(password !== confirmPassword){
                res.status(400).json({message: "As senhas devem ser iguais"})
                return
            }

            const passwordValidate = require('../helpers/ValidatePassword')
            const resultPassword = passwordValidate(password)
            
            let passwordHash
            if(resultPassword.status == 'error'){
                res.status(400).json({message: resultPassword.message})
                return
            }else{
                const salt = bcryptjs.genSaltSync(10)
                passwordHash = bcryptjs.hashSync(password, salt) 
            }
            const newBarberShop = {
                name, email, password: passwordHash, proprietary, phone, state, city, zipcode, cnpj: cnpjGenerate
            }
    
            const user = await BarberShop.create(newBarberShop)
            await createToken(user, 'Barbearia cadastrada!', res)
        }catch(error){
            res.status(400).json({message: "Erro: " + error})
        }
    }
    static async login(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({message: {errors: errors.array()}})
                return
            }
            const {email, password} = req.body
            const userExists = await BarberShop.findOne({where: {email: email}})
            if(!userExists){
                res.status(404).json({message: "Usuário não encontrado, verifique o e-mail e tente novamente!"})
                return
            }
            const comparePassword = bcryptjs.compareSync(password, userExists.password)
            if(!comparePassword){
                res.status(400).json({message: "Senha incorreta, verifique a senha e tente novamente!"})
                return
            }
            await createToken(userExists, 'Usuário logado!', res)
        }catch(error){
            res.status(400).json({message: "Erro: " + error})
        }
    }
    static async getUser(req, res){
        try{
            const user = await getBarberShop(req, res)
            user.password = ''
            res.status(200).json({message: {user: user }})
        }catch(error){
            res.status(400).json({message: "Erro: " + error})
        }
    }
    static async editUser(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({message: {errors: errors.array()}})
                return
            }
            const barberShop = await getBarberShop(req, res)
            const barberShopInDb = await BarberShop.findOne({where: {id: barberShop.id}})

            const {name, proprietary, email, password, phone, city, state, zipcode} = req.body

            let passwordHash
            if(password && !bcryptjs.compareSync(password, barberShopInDb.password)){
                passwordHash = bcryptjs.hashSync(password, 10)
            }
            const newBarberShop = {
                name: name || barberShopInDb.name,
                proprietary: proprietary || barberShopInDb.proprietary,
                email: email || barberShopInDb.email,
                password: passwordHash || barberShop.password,
                phone: phone || barberShopInDb.phone,
                city: city || barberShopInDb.city,
                state: state || barberShopInDb.state,
                zipcode: zipcode || barberShopInDb.zipcode,
            }
            await BarberShop.update(newBarberShop, {where: {id: barberShopInDb.id}})
            res.status(200).json({message: "Informações da barbearia foram editadas!"})
        }catch(error){
            res.status(400).json({message: "Erro: " + error})
        }
    }
    static async getAllClients(req, res){
        try{
            const results = await Client.findAll()
            
            const clients = []
            for(const client of results){
                const lastSchedulingEvent = await SchedulingEvent.findOne({
                    order: [['createdAt', 'DESC']],
                    where: {
                        ClientId: client.id
                    }
                })
                let lastScheduling
                if (lastSchedulingEvent) {
                    lastScheduling = await Scheduling.findOne({where: {id: lastSchedulingEvent.SchedulingId}})
                }
                clients.push({
                    name: client.name,
                    phone: client.phone,
                    lastScheduling: lastScheduling ? lastScheduling.date : null
                })
            }
            
            res.status(200).send(clients)
        }catch(error){
            res.status(400).json({message: "Erro: " + error})
            console.log(error)
        }
    }
}