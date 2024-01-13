const getToken = require('../Autheticate/getToken')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const BarberShop = require('../models/BarberShop')

async function getBarberShopByToken(req, res){
    const token = await getToken(req, res)
    try{
        const decoded = jwt.verify(token, process.env.SECRET)
        const userId = decoded.id
        const user = await BarberShop.findOne({where: {id: userId}})
        if(!user){
            res.status(404).json({message: "Usuário não encontrado"})
            return
        }
        return user
    }catch(error){
        return res.status(401).json({ message: 'Token inválido ou expirado'})
    }
}

module.exports = getBarberShopByToken