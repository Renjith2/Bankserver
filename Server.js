const express = require('express')
const app=express()
const port=9012
const dbconfig= require('./databaseConfig/databaseConfig')
const userApi = require('./routes/UserRoute'); 
const cors= require('cors')

app.use(express.json())
app.use(cors())


app.listen(port,()=>{
    console.log(`Server is Running on PORT ${port}`)
})

app.use('/api/user',userApi)

app.get('/',(req,res)=>{
    res.send("Hi Welcome")
})