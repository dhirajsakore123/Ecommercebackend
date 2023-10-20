
const product = require("../model/ProductModel")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User=require('../model/User')
const Razorpay = require('razorpay')

const razorpay = new Razorpay({
    key_id: 'rzp_test_8gAAcZx74kP2Zm',
    key_secret: 'kBRDHOma9uI4kGttNxfyxFYd',
})


async function RazorPay(req, res) {

    const amount=req.body.amount

    const options = {
        amount:amount,
        currency: 'INR',
        receipt: 'dhirajsakore@gmail.com',
      
    }

    try {
        const response = await razorpay.orders.create(options);
        res.send({
            success:true,
            msg:'Order Created',
            order_id:response.id,
            amount:options.amount,
            key_id:'rzp_test_8gAAcZx74kP2Zm'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function register(req, res) {
    try {
        const temp = req.body
        // validation 
       
        //bcrypt
        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(temp.password, salt)
       
        //create user
     
        const user = await User.create({ firstname:temp.firstname, lastname: temp.lastname, email: temp.email, password: `${hashedPassword}` })
        const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "24h" })
        res.status(200).send({msg:"user register Sucessfully" ,user:user ,token:token})


    }

    catch (e) {
        console.log(e)
        res.status(500).send({ msg: "not created ", err: e })
    }

}
async function loginUser(req, res) {
    try {
        let data = req.body
        console.log(data)
        // validation
        // check for user in database 
        // const login = await User.findOne({ where: { username: username }, attributes: ["firstname", "lastname", "email", "password"] })
        const login = await User.findOne({email:data.email})
        if (!login) {
            return res.send({ msg: "user not found" })
        }
        
        // compare the password from request and database
        if (await bcrypt.compare(data.password, login.password) == false) {
            return res.send({ msg: "incorrect password" })

        }

        // create jwttoken

        const token = jwt.sign({ _id: login._id }, "secret", { expiresIn: "24h" })

        console.log(login, token)
        res.status(200).send({msg:"user Loggedin Sucessfully", user: login, token: token })
    }
    catch (e) {
        res.status(500).send("error occured", e)
    }

}

async function cart(req,res){
      
    try {
        const userId=req.body.userId

      const populatedCart=  await User.findById(userId)
        .populate('cart.productId') // Populate the 'productId' field in the 'cart' array
        
                res.send({msg:"this is cart" ,user:populatedCart})
              
           
        
    } catch (e) {
        res.status(500).send({ msg: e })  
    }
}

async function RemoveCartItem(req,res){
      
    try {
      const userId=req.body.userId
      const productId=req.body.productId
    //   const productIdToRemove = mongoose.Types.ObjectId(`${productId}`)
   
    const find=await User.findOne({_id:userId,'cart.productId':productId})
    
    
       if(!find){
        console.log("error")
       }
       else{
       const user=await User.findByIdAndUpdate(userId,{
            $pull: { cart: { productId:productId }}
        })
        return  res.status(200).send({msg: "product removed",user:user})

       }
    
         
   
    } catch (e) {
        res.status(500).send({ msg: e })  
    }
}


async function addtocart(req, res) {
    try {
        const userId = req.body.userId
        const productId = req.body.productId
        
   
        const find=await User.findOne({_id:userId,'cart.productId':productId})
       

            if(!find){
                await User.updateOne({_id:userId},{
                    $push: { cart: { productId:productId ,quantity:1 } }
                }, { new: true })
                return  res.status(200).send({msg: "product Added to cart"})
          

            }
           else{
             
          const obj= find.cart.find(item=>item.productId.toString()===productId)
              obj.quantity+=1
              await find.save()
            return res.status(200).send({msg:"product already exist in cart"})
   
        }
               
                
            }
       
          
     

    
    catch (e) {
        res.status(500).send({ msg: e })
    }

}




async function catogary(req,res){
     try{
          
        const productdata = await product.find({catogary:`${req.params.catogary}`})
           res.status(200).send(productdata)
     }
     catch(err){
         res.send('error occured' , err)
     }
 
 }



 async function search(req,res){
     try{
          
          const search=new RegExp(req.params.search,'i')
        const productdata = await product.find({name:search})
       
           res.status(200).send(productdata)
     }
     catch(err){
         res.send('error occured' , err)
         
     }
 
 }

async function addNewProduct(req,res){
     try{
        const productdata = await product.create(data)
           res.send({user:  productdata})
     }
     catch(err){
         res.send('error occured' , err)
     }
 
 }

async function Id(req,res){
     try{
          
        const productdata = await product.find({_id:`${req.params.id}`})
           res.status(200).send(productdata)
     }
     catch(err){
         res.send('error occured' , err)
     }
 
 }

async function catogary2(req,res){
     try{
          
        const productdata = await product.find({catogary2:`${req.params.catogary2}`})
           res.status(200).send(productdata)
     }
     catch(err){
         res.send('error occured' , err)
     }
 
 }
 async function Allproducts(req,res){
    try{
         
       const productdata = await product.find()
          res.status(200).send(productdata)
    }
    catch(err){
        res.send('error occured' , err)
    }

}

async function PlusQuantity(req,res){
    try{
        const userId = req.body.userId
        const productId = req.body.productId
        
   
        const find=await User.findOne({_id:userId,'cart.productId':productId})
        const obj= find.cart.find(item=>item.productId.toString()===productId)
        obj.quantity+=1
        await find.save()
      return res.status(200).send({msg:"product already exist in cart"})
      
    }
    catch(err){
        res.send('error occured' , err)
    }

}
async function MinusQuantity(req,res){
    try{
         
        const userId = req.body.userId
        const productId = req.body.productId
        
   
        const find=await User.findOne({_id:userId,'cart.productId':productId})
        const obj= find.cart.find(item=>item.productId.toString()===productId)
       if(obj.quantity>1){
        obj.quantity-=1
       }
        await find.save()
      return res.status(200).send({msg:"product already exist in cart"})
    }
    catch(err){
        res.send('error occured' , err)
    }

}


async function PlaceOrder(req,res){
    try{
        const userId=req.body.userId;  
       const user= await User.findById(userId)
         console.log(user.cart);
       user.ordered.push(...user.cart)
       user.cart=[]
       await user.save()
     
        res.send({user:user})

       }
    catch(err){
        res.send('error occured' , err)
    }

}




module.exports={catogary,Id,catogary2,addNewProduct,search,register,loginUser,addtocart,cart,Allproducts,RemoveCartItem,PlusQuantity,MinusQuantity,RazorPay,PlaceOrder}