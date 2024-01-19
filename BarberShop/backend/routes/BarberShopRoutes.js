const express = require('express')
const router = express.Router()
const BarberShopController = require('../controllers/BarberShopController')
const {body} = require("express-validator")
const verifyIsAdmin = require('../Autheticate/verifyIsAdmin')

router.post('/register', [
    body('name').notEmpty().withMessage("O campo NOME não pode ser nulo!"),
    body('email').notEmpty().withMessage("O campo EMAIL não pode ser nulo!"),
    body('password').notEmpty().withMessage("O campo SENHA não pode ser nulo!"),
    body('confirmPassword').notEmpty().withMessage("O campo CONFIRME SENHA não pode ser nulo!"),
    body('proprietary').notEmpty().withMessage("O campo PROPRIETÁRIO não pode ser nulo!"),
    body('phone').notEmpty().withMessage("O campo TELEFONE não pode ser nulo!"),
    body('state').notEmpty().withMessage("O campo ESTADO não pode ser nulo!"),
    body('city').notEmpty().withMessage("O campo CIDADE não pode ser nulo!"),
    body('zipcode').notEmpty().withMessage("O campo CEP não pode ser nulo!"),
],
BarberShopController.register)

router.post('/login', [
    body('email').notEmpty().withMessage("O campo EMAIL não pode ser nulo!"),
    body('password').notEmpty().withMessage("O campo SENHA não pode ser nulo!")
], BarberShopController.login)
router.get('/user', verifyIsAdmin, BarberShopController.getUser)

router.get('/all-client', verifyIsAdmin, BarberShopController.getAllClients)

router.patch('/edit-user', [
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
], verifyIsAdmin, BarberShopController.editUser)


module.exports = router