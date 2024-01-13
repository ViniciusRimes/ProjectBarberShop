const jwt = require('jsonwebtoken')
const getToken = require('../Autheticate/getToken')
require('dotenv').config()

async function verifyOneToken(req, res, next){
    const token = await getToken(req)
    jwt.verify(token,process.env.SECRET, function(error){
        if(error){
            res.status(403).json({message: 'Token inválido'})
        }else{
            next()
        }
        
    })
    
}
module.exports = verifyOneToken