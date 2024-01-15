const express = require('express')
const router = express.Router()
const ClientController = require('../controllers/ClientController')
const {body} = require("express-validator")
const {upload} = require('../helpers/ImageUpload')

router.post('/register', upload.single('img') ,ClientController.register)
router.post('/login', [
    body('phone').notEmpty().withMessage("O campo TELEFONE não pode estar nulo!"),
    body('password').notEmpty().withMessage("O campo SENHA não pode estar nulo!"),
], ClientController.login)

module.exports = router