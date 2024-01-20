const express = require('express')
const router = express.Router()
const {body} = require("express-validator")
const verifyIsAdmin = require('../Autheticate/verifyIsAdmin')
const AccountingController = require('../controllers/AccountingController')

router.post('/create-months', verifyIsAdmin, AccountingController.createMonths)
router.get('/', verifyIsAdmin, AccountingController.getAccounting)

module.exports = router