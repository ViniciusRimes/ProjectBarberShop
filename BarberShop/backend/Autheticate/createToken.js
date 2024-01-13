const jwt = require('jsonwebtoken')
require('dotenv').config()

async function createUserFunction(user, message, res){
    try{
        const token = jwt.sign({
            user: user.id,
            email: user.email
        }, process.env.SECRET, {expiresIn: '5h'} )
        
        res.status(201).json({message: `${message ? message : ''}, Você está autenticado!`, token: token})
    }catch(error){
        res.status(500).json({message: 'Ocorreu um erro na geração do token! Erro: ' + error})
    }
}
module.exports = createUserFunction