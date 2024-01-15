const express = require('express')
const router = express.Router()
const SchedulingController = require('../controllers/SchedulingController')
const {body} = require('express-validator')

router.post('/generate_schedules', [
    body('startDate').notEmpty().withMessage('O campo DIA INICIAL não pode ser nulo'),
    body('endDate').notEmpty().withMessage('O campo DIA FINAL não pode ser nulo'),
    body('startTime').notEmpty().withMessage('O campo HORÁRIO INICIAL não pode ser nulo'),
    body('endTime').notEmpty().withMessage('O campo HORÁRIO FINAL não pode ser nulo'),
    body('intervalMinutes').notEmpty().withMessage('O campo INTERVALO DE MINUTOS não pode ser nulo'),
], SchedulingController.generateSchedules)
router.get('/available_times', [
    body('selectedDate').notEmpty().withMessage('O campo DATA não pode ser nulo'),
], SchedulingController.availableTimes)


module.exports = router