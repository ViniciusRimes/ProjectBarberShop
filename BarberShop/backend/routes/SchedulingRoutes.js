const express = require('express')
const router = express.Router()
const SchedulingController = require('../controllers/SchedulingController')
const {body} = require('express-validator')
const verifyIsAdmin = require('../Autheticate/verifyIsAdmin')
const verifyToken = require('../Autheticate/verifyToken')

router.post('/generate', [
    body('startDate').notEmpty().withMessage('O campo DIA INICIAL não pode ser nulo'),
    body('endDate').notEmpty().withMessage('O campo DIA FINAL não pode ser nulo'),
    body('startTime').notEmpty().withMessage('O campo HORÁRIO INICIAL não pode ser nulo'),
    body('endTime').notEmpty().withMessage('O campo HORÁRIO FINAL não pode ser nulo'),
    body('intervalMinutes').notEmpty().withMessage('O campo INTERVALO DE MINUTOS não pode ser nulo'),
], verifyIsAdmin, SchedulingController.generateSchedules)

router.get('/available-dates', SchedulingController.availableDates)
router.get('/available-times/:selectedDate', SchedulingController.availableTimes)
router.get('/my-schedulings', verifyToken, SchedulingController.getMySchedulings)

router.patch('/reserve-time', [
    body('date').notEmpty().withMessage('O campo DATA não pode ser nulo'),
    body('time').notEmpty().withMessage('O campo HORÁRIO não pode ser nulo'),
    body('serviceId').notEmpty().withMessage('O campo ID DO SERVIÇO não pode ser nulo'),
], verifyToken, SchedulingController.reserveTime)

router.patch('/finished/:schedulingId', verifyIsAdmin, SchedulingController.updateSchedules)
router.patch('/finished-many', verifyIsAdmin, SchedulingController.updateAllSchedules)

router.delete('/:schedulingId', verifyIsAdmin, SchedulingController.deleteScheduling)

router.patch('/cancel/:schedulingId', verifyToken, SchedulingController.cancelScheduling)

module.exports = router