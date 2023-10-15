
const {catogary,Id,catogary2,addNewProduct,search,register,loginUser,addtocart,cart,Allproducts,RemoveCartItem,PlusQuantity,MinusQuantity} = require("../controller/UserController")

const route=require("express").Router()

route.post("/register",register)
route.post("/addtocart",addtocart)
route.post("/cart",cart)
route.post("/login",loginUser)
route.post("/addnewproduct",addNewProduct)
route.post("/minusquantity",MinusQuantity)
route.post("/plusquantity",PlusQuantity)
route.post("/removecartitem",RemoveCartItem)
route.get("/search/:search",search)
route.get("/catogary/:catogary",catogary)
route.get("/Id/:id",Id)
route.get("/catogary2/:catogary2",catogary2)
route.get("/allproducts",Allproducts)

module.exports=route