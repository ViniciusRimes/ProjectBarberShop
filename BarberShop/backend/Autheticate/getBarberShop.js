const getToken = require('../Autheticate/getToken')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const BarberShop = require('../models/BarberShop')

async function getBarberShopByToken(req, res){
    try{
        const token = await getToken(req)
        console.log(token)
        if(!token){
            return res.status(401).json({ message: 'Token inválido ou expirado'})
        }
        const decoded = jwt.verify(token, process.env.SECRET)
        if(!decoded){
            return res.status(401).json({ message: 'Token inválido ou expirado'})
        }
        const userId = decoded.id
        const user = await BarberShop.findOne({where: {id: userId}})
        if(!user){
            res.status(404).json({message: "Usuário não encontrado"})
            return
        }
        return user
    }catch(error){
        res.status(401).json({ message: 'Token inválido ou expirado'})
    }
}

module.exports = getBarberShopByToken