const getToken = require('../Autheticate/getToken')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Client = require('../models/Client')

async function getClientShopByToken(req, res){
    try{
        const token = await getToken(req)
        console.log(token)
        if(!token){
            res.status(401).json({ message: 'Token inválido ou expirado'})
            return
        }
        const decoded = jwt.verify(token, process.env.SECRET)
        if(!decoded){
            res.status(401).json({ message: 'Token inválido ou expirado'})
            return
        }
        const userId = decoded.id
        const user = await Client.findOne({where: {id: userId}})
        if(!user){
            res.status(404).json({message: "Usuário não encontrado"})
            return
        }
        return user
    }catch(error){
        res.status(401).json({ message: 'Token inválido ou expirado'})
    }
}

module.exports = getClientShopByToken