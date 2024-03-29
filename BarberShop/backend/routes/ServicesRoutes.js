const express = require('express')
const router = express.Router()
const ServicesController = require('../controllers/ServicesController.js')
const verifyIsAdmin = require('../Autheticate/verifyIsAdmin.js')
const {body} = require('express-validator')

router.post('/', [
    body('name').notEmpty().withMessage("O campo NOME não pode ser nulo!"),
    body('duration').notEmpty().withMessage("O campo DURAÇÃO não pode ser nulo!"),
    body('value').notEmpty().withMessage("O campo PREÇO não pode ser nulo!"),
], verifyIsAdmin, ServicesController.createService)
router.delete('/:serviceId', verifyIsAdmin, ServicesController.deleteService)
router.patch('/:serviceId', verifyIsAdmin, ServicesController.editService)
router.get('/all', ServicesController.getServices)

module.exports = router