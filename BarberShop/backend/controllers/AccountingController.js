const getBarberShop = require('../Autheticate/getBarberShop')
const Accounting = require('../models/Accounting')

module.exports = class AccountingController{
    static async updateAccounting(req, res, monthYear, servicesProvided, totalAmount){
        try{
            const barberShop = await getBarberShop(req, res)
            await Accounting.update({monthYear: monthYear, servicesProvided: servicesProvided, totalAmount: totalAmount}, {where: {BarberShopId: barberShop.id}})
        }catch(error){
            res.status(500).json({ message: 'Erro ao atualizar contabilidade.' })
        }
    }
}