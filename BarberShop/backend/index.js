const express = require("express")
const app = express()

//middlewares
app.use(express.json())


//routes
const BarberShopRoutes = require('./routes/BarberShopRoutes')
app.use('/barbershop', BarberShopRoutes )


//models
const BarberShop = require('./models/BarberShop')

const conn = require('./db/conn')
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