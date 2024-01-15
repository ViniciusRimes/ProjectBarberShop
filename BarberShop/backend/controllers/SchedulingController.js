const Scheduling = require('../models/Scheduling')
const {validationResult} = require("express-validator")
const {Op} = require('sequelize')
const {format, getDay} = require('date-fns')

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
    static async availableTimes(req, res){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({message: {errors: errors.array()}})
                return
            }
            const selectedDate = req.body.selectedDate
        
            const availableTimes = await Scheduling.findAll({where: {
                available: null,
                date: {
                    [Op.eq]: selectedDate
                }
            }})

            if(availableTimes.length === 0){
                res.status(400).json({message: "Nenhum horário disponível"})
                return
            }
            let allAvailableTimes =[]
            availableTimes.forEach(element => {
                allAvailableTimes.push({
                    date: element.date,
                    time: element.time
                })
            });
            res.status(200).send(allAvailableTimes)
        }catch(error){
            res.status(500).json({ message: 'Erro ao gerar agendamentos: ' + error});
            console.log(error)
        }
    }
    static async reserveDate(req, res){
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({message: {errors: errors.array()}})
            return
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
            const [year, month, day] = date.split('-')
            const [hours, minutes] = time.split(':')
            schedules.push({
                date: day+"/"+month+"/"+year,
                time: hours+":"+minutes
            });
        }
    }

    return schedules;
}
