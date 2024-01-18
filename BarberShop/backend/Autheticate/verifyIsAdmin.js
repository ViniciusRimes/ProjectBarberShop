const jwt = require('jsonwebtoken')
const getToken = require('../Autheticate/getToken')
const BarberShop = require('../models//BarberShop')
require('dotenv').config()

async function verifyAdmin(req, res, next){
    try{
        const token = await getToken(req)
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' })
        }
        const decoded = jwt.verify(token, process.env.SECRET)
        if(!decoded){
            return res.status(401).json({ message: 'Token inválido ou expirado'})
        }
        const userIsAdmin = await BarberShop.findOne({where: {name: decoded.user}})
        if(userIsAdmin){
            next()
        }else{
            return res.status(403).json({ message: 'Acesso negado'})
        }
    }catch(error){
        res.status(403).json({message: 'Token inválido ou não identificado!'})
        console.log(error)
    }
}
module.exports = verifyAdmin