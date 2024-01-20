const express = require("express")
const app = express()

//middlewares
app.use(express.json())

//routes
const BarberShopRoutes = require('./routes/BarberShopRoutes')
app.use('/barbershop', BarberShopRoutes )
const SchedulingRoutes = require('./routes/SchedulingRoutes')
app.use('/scheduling', SchedulingRoutes )
const ClientRoutes = require('./routes/ClientRoutes')
app.use('/client', ClientRoutes )
const ServicesRoutes = require('./routes/ServicesRoutes')
app.use('/services', ServicesRoutes )
const AccountingRoutes = require('./routes/AccountingRoutes')
app.use('/accounting', AccountingRoutes )


//models
const BarberShop = require('./models/BarberShop')
const Scheduling = require('./models/Scheduling')
const SchedulingEvent = require('./models/SchedulingEvent')
const Services = require('./models/Services')
const Accounting = require('./models/Accounting')


const conn = require('./db/conn')
const { ExpressValidator } = require("express-validator")
conn
.sync()
//.sync({force: true})
//.sync({alter: true})
.then(() => {
    console.log("Database conectado")
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    })
}).catch((error)=>{
    console.log("Ocorreu um erro: " + error)
})