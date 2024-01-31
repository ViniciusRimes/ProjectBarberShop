const Scheduling = require('../models/Scheduling')
const SchedulingEvent = require('../models/SchedulingEvent')
const {validationResult} = require("express-validator")
const {Op, fn, col} = require('sequelize')
const {format} = require('date-fns')
const getClient = require('../Autheticate/getClient')
const Services = require('../models/Services')
const AccountingController = require('../controllers/AccountingController')

module.exports = class SchedulingController{
    static async generateSchedules(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({message: {errors: errors.array()}})
                return
            }
            const {startDate, endDate, startTime, endTime, intervalMinutes} = req.body
           const schedules = generateSchedules(startDate, endDate, startTime, endTime, intervalMinutes)
            console.log(schedules)
             await Scheduling.bulkCreate(schedules)
            
            res.status(201).json({ message: 'Agendamentos gerados com sucesso!'})
        }catch(error){
            res.status(500).json({ message: 'Erro ao gerar agendamentos: ' + error});
            console.log(error)
        }
    }
    static async availableDates(req, res){
        try{
            const datesInDb = await Scheduling.findAll({
                attributes: [
                    [fn('DISTINCT', col('date')), 'date']
                ],
                raw: true,
            })
            const dates = []
            for(let item of datesInDb){
                const newDate ={
                    date: format(item.date, 'dd-MM-yyyy')
                }
                dates.push(newDate)
            }
            res.status(200).send(dates)
        }catch(error){
            res.status(500).json({ message: 'Erro ao atualizar serviço: ' + error})
        }

    }
    static async availableTimes(req, res){
        try{
            const selectedDate = req.params.selectedDate
        
            const availableTimes = await Scheduling.findAll({where: {
                available: null,
                date: {
                    [Op.eq]: selectedDate
                }
            }})

            let allAvailableTimes =[]
            availableTimes.forEach(element => {
                allAvailableTimes.push({
                    date: element.date,
                    time: element.time
                })
            });
            res.status(200).send(allAvailableTimes)
        }catch(error){
            res.status(500).json({ message: 'Erro ao buscar horários: ' + error});
            console.log(error)
        }
    }
    static async reserveTime(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({message: {errors: errors.array()}})
                return
            }
            const {date, time, serviceId} = req.body
            const user = await getClient(req, res)
            
            const availableTime = await Scheduling.findOne({where: {
                date: {
                    [Op.eq]: date
                },
                time: {
                    [Op.eq]: time
                },
                available: null
            }})
            if(!availableTime){
                res.status(400).json({message: "Horário escolhido não está mais disponível, por favor escolha outro!"})
                return
            }
            const serviceExists = await Services.findOne({where: {id: serviceId}})

            if(!serviceExists){
                res.status(404).json({message: "Não existe nenhum serviço com este Id!"})
                return
            }

            await Scheduling.update({available: true, ClientId: user.id, ServiceId: serviceExists.id}, {where: {id: availableTime.id} })
            await SchedulingEvent.create({ClientId: user.id, SchedulingId: availableTime.id, ServiceId: serviceExists.id })
            res.status(200).json({message: "Horário agendado com sucesso!"})
        }catch(error){
            res.status(500).json({ message: 'Erro ao agendar horário: ' + error});
            console.log(error)
        }
    }
    static async updateSchedules(req, res){
        try{
            const schedulingId = req.params.schedulingId
            const scheduling = await Scheduling.findOne({where: {id: schedulingId}})
            if(!scheduling){
                res.status(404).json({message: "Agendamento de horário não encontrado!"})
                return
            }
            if(!scheduling.available){
                res.status(400).json({message: "O horário não possui clientes agendados, logo não é possível marcá-los como concluído!"})
                return
            }
            const serviceProvided = await Services.findOne({where: {id: scheduling.ServiceId}})

            await Scheduling.update({finished: true}, {where: {id: scheduling.id}})
            await SchedulingEvent.update({finished: true}, {where: {SchedulingId: scheduling.id}})
            const currentDate = new Date()
            const monthYear = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
            await AccountingController.updateAccounting(req, res, monthYear, 1, serviceProvided.value)
        
            res.status(200).json({message: "Serviço prestado com sucesso!"})
        }catch(error){
            res.status(500).json({ message: 'Erro ao atualizar serviço: ' + error})
        }
    } 
    static async deleteScheduling(req, res){
        try{
            const schedulingId = req.params.schedulingId
            const scheduling = await Scheduling.findOne({where: {id: schedulingId}})
            if(!scheduling){
                res.status(404).json({message: "Agendamento de horário não encontrado!"})
                return
            }
            await Scheduling.destroy({where: {id: scheduling.id}})
            res.status(200).json({message: "Horário excluído!"})

        }catch(error){
            res.status(500).json({ message: 'Erro ao cancelar serviço: ' + error})
        }
        
    }
    static async cancelScheduling(req, res){
        try{
            const {schedulingId} = req.params
            const user = await getClient(req, res)
            if(!user){
                return
            }
            const scheduling = await Scheduling.findOne({where: {id: schedulingId, finished: null, ClientId: user.id}})
            if(!scheduling){
                res.status(404).json({message: "Agendamento de horário não encontrado!"})
                return
            }
            await Scheduling.update({
                available: null, ClientId: null, ServiceId: null
            }, {where: {id: scheduling.id, ClientId: user.id}})
            await SchedulingEvent.destroy({where: {SchedulingId: scheduling.id, ClientId: user.id}})
            res.status(200).json({message: "Agendamento cancelado!"})
        }catch(error){
            res.status(500).json({ message: 'Erro ao cancelar agendamento: ' + error})
        }
    }
    static async updateAllSchedules(req, res){
        try{
            const currentDate = new Date()
            const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:00`
            currentDate.setHours(0,0,0,0)
            const allSchedules = await Scheduling.findAll({where: {
                time: {
                    [Op.lt]: currentTime
                },
                date: {
                    [Op.lte]: currentDate
                },
                available: true,
                finished: null
            }})
            for(let schedule of allSchedules){
                await Scheduling.update({finished: true}, {where: {
                    id: schedule.id
                }})
                await SchedulingEvent.update({finished: true}, {where: {
                    SchedulingId: schedule.id
                }})
            }
            res.status(200).json({message: `${allSchedules.length} serviços foram prestados com sucesso!`})
        }catch(error){
            res.status(500).json({ message: 'Erro ao cancelar agendamento: ' + error})
            console.log(error)
        }
    }
}

function generateDates(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);

    while (currentDate <= endDateObj) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

function generateTimes(startTime, endTime, intervalMinutes) {
    const times = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let currentMinute = startHour * 60 + startMinute;

    while (currentMinute <= endHour * 60 + endMinute) {
        const hour = Math.floor(currentMinute / 60);
        const minute = currentMinute % 60;

        // Formate os minutos para ter dois dígitos
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');

        times.push(`${formattedHour}:${formattedMinute}`);
        currentMinute += intervalMinutes;
    }

    return times;
}

function generateSchedules(startDate, endDate, startTime, endTime, intervalMinutes) {
    const dates = generateDates(startDate, endDate);
    const times = generateTimes(startTime, endTime, intervalMinutes);

    const schedules = [];

    for (const date of dates) {
        for (const time of times) {
            // const [year, month, day] = date.split('-')
            // const [hours, minutes] = time.split(':')
            schedules.push({
                date: date,
                time: time
            });
        }
    }

    return schedules;
}
