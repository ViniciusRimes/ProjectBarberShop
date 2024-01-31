const getBarberShop = require('../Autheticate/getBarberShop')
const Accounting = require('../models/Accounting')
const {Op}= require('sequelize')
const {format} = require('date-fns')
module.exports = class AccountingController{
    static async updateAccounting(req, res, monthYear, servicesProvided, totalAmount){
        try{
            const monthYearDate = new Date(`${monthYear}-01`); // Assumindo que o dia é sempre 01
            const barberShop = await getBarberShop(req, res)
            const dateExists = await Accounting.findOne({
                where: {
                    monthYear: {
                        [Op.and]: [
                            { [Op.substring]: monthYear.substring(0, 4) }, // Verifica o ano
                            { [Op.substring]: monthYear.substring(5) }      // Verifica o mês
                        ]
                    },
                    BarberShopId: barberShop.id
                }
            });
            const servicesProvidedInDb = dateExists.servicesProvided
            const totalAmountInDb = dateExists.totalAmount
            
            await Accounting.update({servicesProvided: servicesProvidedInDb + servicesProvided, totalAmount: totalAmountInDb + totalAmount}, {where: {
            monthYear: dateExists.monthYear}})        
        }catch(error){
            //res.status(500).json({ message: 'Erro ao atualizar contabilidade.' })
        }
    }
    static async createMonths(req, res){
        try{
            const barberShop = await getBarberShop(req, res)
            const {accountingDay} = req.body
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            await Accounting.create({
                monthYear: currentDate.toISOString().split('T')[0],
                totalAmount: 0,
                servicesProvided: 0,
                BarberShopId: barberShop.id
            })
            for (let i = 0; i < 12; i++) {
                currentDate.setMonth(currentDate.getMonth() + 1);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1
                const lastDayOfMonth = new Date(year, month, 0).getDate();
                const day = Math.min(accountingDay, lastDayOfMonth)
                await Accounting.create({
                    monthYear: `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`,
                    totalAmount: 0,
                    servicesProvided: 0,
                    BarberShopId: barberShop.id
                });
            }
            res.status(200).json({message: 'Meses criados com sucesso.'})
        }catch(error){
            res.status(500).json({error: 'Ocorreu um erro ao criar os meses.'});
        }
    }
    static async getAccounting(req, res){
        try{
            const getAccountings = await Accounting.findAll()
            const accountings = []
            for(let item of getAccountings){
                const accounting = {
                    monthYear: format(item.monthYear, 'dd-MM-yyyy' ),
                    servicesProvided: item.servicesProvided,
                    totalAmount: item.totalAmount
                }
                accountings.push(accounting)
            }
            res.status(200).send(accountings)
        }catch(error){
            res.status(500).json({error: 'Ocorreu um erro ao obter a contabilidade.'});
            console.log(error)
        }
    }
}