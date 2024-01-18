const express = require('express')
const router = express.Router()
const ClientController = require('../controllers/ClientController')
const {body} = require("express-validator")
const {upload} = require('../helpers/ImageUpload')
const verifyToken = require("../Autheticate/verifyToken")

router.post('/register', upload.single('img') ,ClientController.register)

router.post('/login', [
    body('phone').notEmpty().withMessage("O campo TELEFONE não pode estar nulo!"),
    body('password').notEmpty().withMessage("O campo SENHA não pode estar nulo!"),
], ClientController.login)
router.get('/getuser', verifyToken, ClientController.getClient)
router.patch('/edituser', [
    body('password').optional().notEmpty().withMessage("O campo SENHA não pode estar nulo!"),
    body('confirmPassword').custom((value, {req}) =>{
        if(req.body.password){
            if(!value){
                throw new Error("Confirme a senha digitando novamente no campo CONFIRMAR SENHA.")
            }else if(value !== req.body.password){
                throw new Error("As senhas não coincidem. Digite novamente no campo CONFIRMAR SENHA.");

            }
        }
        return true
    })
], verifyToken, ClientController.editClient)

module.exports = router