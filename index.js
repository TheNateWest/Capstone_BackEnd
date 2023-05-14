require("dotenv").config()
const express=require("express")
const cors=require("cors")

const app=express()
const port=process.env.PORT||3333

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const usersRoutes = require("./Routes/users")
const recipeRoutes = require("./Routes/recipes")

app.use('/users', usersRoutes);
app.use('/recipes', recipeRoutes);


app.get("/",(req, res) => {
    res.json({message:"welcome to so hungry backend"})
})

app.listen(port, () => {
    console.log("listening on Port:",port)
})