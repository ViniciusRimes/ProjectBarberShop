const express = require('express')
const router = express.Router()
const {body} = require("express-validator")
const verifyIsAdmin = require('../Autheticate/verifyIsAdmin')
const AccountingController = require('../controllers/AccountingController')




module.exports = router