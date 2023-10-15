const express=require('express')
require('dotenv').config()
const  route  = require('./routes/UserRoutes')
const app=express()
const port=4000
const cors=require("cors")
const connectToDb = require('./db/Connection')
app.use(cors({
    origin:"*"
}))
app.use(express.json())

app.use("/products",route)

const startConnection =async ()=>{
    try{
        await connectToDb(process.env.MONGO_URL)
        app.listen(port , ()=>{
            console.log(`Server is live on port ${port}`);
        })
    }
    catch(err){
        console.log(err);
    }
}
startConnection()