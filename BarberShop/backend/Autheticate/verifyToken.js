const jwt = require('jsonwebtoken')
const getToken = require('../Autheticate/getToken')
require('dotenv').config()

async function verifyOneToken(req, res, next){
    try{
        const token = await getToken(req)
        if(!token){
            res.status(401).json({message: 'Acesso negado, entre com sua conta para acessar!'})
            return
        }
        jwt.verify(token,process.env.SECRET, function(error){
            if(error){
                res.status(403).json({message: 'Token inválido'})
            }else{
                next()
            }
            
        })
    }catch(error){
        res.status(403).json({message: 'Erro ao verificar o token'})
    }
}
module.exports = verifyOneToken