const createToken = require('../Autheticate/createToken')
const Client = require('../models/Client')
const {validationResult} = require("express-validator")
const bcryptjs = require('bcryptjs')

module.exports = class ClientController{
    static async register(req, res){
        /*const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({message: {errors: errors.array()}})
            return
        }*/
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
            const salt = bcryptjs.genSaltSync(10)
            const passwordHash = bcryptjs.hashSync(password, salt)

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
}