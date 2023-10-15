const mongoose=require('mongoose')

const schema=mongoose.Schema

const product=new schema({
    "id":String,
    "image":String,
    "name":String,
    "description":String,
    "costprice":String,
    "sellingprice":String,
     "discount":String,
     "rating":String,
     "catogary":String,
     "catogary2":String 

})

module.exports=mongoose.model('product',product)