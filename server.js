const express = require("express")
const { json }= require("body-parser")
const userRoutes = require("./src/Routes/User")
const cors = require('cors');
require("./src/Database/connection")

//Getting the port to run the server on
const PORT = process.eventNames.PORT || 3000

//creating an express app
const app = express()



//Parsing the body, to support Application/JSON
app.use(json());

app.options('*', cors())

//Setting up routes for LOGIN, LOGOUT, RESET_PASSWORD
app.use("/users",userRoutes);

//Running the App on the desired PORT number
app.listen(PORT, ()=>{
    console.log("App is running on PORT: " + PORT)
})