const createToken = require('../Autheticate/createToken')
const Client = require('../models/Client')
const {validationResult} = require("express-validator")
const bcryptjs = require('bcryptjs')
const getClient = require('../Autheticate/getClient')
const {Op} = require('sequelize')

module.exports = class ClientController{
    static async register(req, res){
        try{
            const {name, phone, password, confirmPassword} = req.body
            let img;
            if(req.file){
                img = req.file.filename
            }
            const userExists = await Client.findOne({where: {phone: phone}})
            if(userExists){
                res.status(400).json({message: "Usuário já cadastrado! Faça login ou se cadastre usando outro telefone"})
                return
            }
            if(password != confirmPassword){
                res.status(400).json({message: "As senhas devem ser iguais!"})
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

            const user = await Client.create({name, phone, password: passwordHash, img})
            await createToken(user, "Usuário cadastrado!", res)
        }catch(error){
            res.status(500).json({message: "Erro:" + error})
        }
    }
    static async login(req, res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({message: {errors: errors.array()}})
            return
        }
        try{    
            const {phone, password} = req.body
            const userExists = await Client.findOne({where: {phone: phone}})
            if(!userExists){
                res.status(400).json({message: "Nenhum usuário encontrado! Cadastre ou recupere os dados de login!"})
                return
            }
            const comparePassword = bcryptjs.compareSync(password, userExists.password)
            if(!comparePassword){
                res.status(400).json({message: "Senha incorreta!"})
                return
            }
            await createToken(userExists, "Usuário logado", res)
        }catch(error){
            res.status(500).json({message: "Erro:" + error})
        }
    }
    static async getClient(req, res){
        try{
            const client = await getClient(req, res)
            if(!client){
                return
            }
            const userExists = await Client.findOne({where: {id: client.id}})
            if(!userExists){
                res.status(400).json({message: "Usuário não encontrado!"})
                return
            }
            userExists.password = ''
            res.status(200).send(userExists)
        }catch(error){
            res.status(500).json({message: "Erro:" + error})
        }
    }
    static async editClient(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({message: {errors: errors.array()}})
                return
            }
            const client = await getClient(req, res)
            if(!client){
                return
            }
            const userExists = await Client.findOne({where: {id: client.id}})
            if(!userExists){
                res.status(400).json({message: "Usuário não encontrado!"})
                return
            }
            const {name, phone, password} = req.body
            const img = req.file
            
            const phoneExists = await Client.findOne({where: {
                phone: {
                    [Op.like]: phone
                }
            }})
            if(phoneExists){
                res.status(400).json({message: "O telefone digitado já está cadastrado por outro usuário!"})
                return
            }
            let passwordHash
            if(password && !bcryptjs.compareSync(password, userExists.password)){
                const salt = bcryptjs.genSaltSync(10)
                passwordHash = bcryptjs.hashSync(password, salt)
            }
            

            await Client.update({
                name: name || userExists.name, phone: phone || userExists.phone, password: passwordHash || userExists.password, img: img || userExists.img
            }, {where: {id: userExists.id}})
           
            res.status(201).json({message: "Usuário editado!"})
        }catch(error){
            res.status(400).json({message: "Erro: " + error})
            console.log(error)
        }   
    }
}