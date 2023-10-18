const mongoose=require('mongoose')

const schema=mongoose.Schema

const User=new schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    cart:[
        {
            productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
           
        },
        quantity:{type:Number}
    }]
    ,
    ordered:[]
})

module.exports=mongoose.model('User',User)