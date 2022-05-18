const express = require("express")
const { json }= require("body-parser")
const userRoutes = require("./src/Routes/User")
const cors = require('cors');
require("./src/Database/connection")

//Getting the port to run the server on
const PORT = process.eventNames.PORT || 8000

//creating an express app
const app = express()



//Parsing the body, to support Application/JSON
app.use(json());

var allowedOrigins = ['http://localhost:3000' ];
app.use(cors({
    origin: function (origin, callback) {    // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        } return callback(null, true);
    },
    credentials: true
}));

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain)

//Setting up routes for LOGIN, LOGOUT, RESET_PASSWORD
app.use("/users",userRoutes);

//Running the App on the desired PORT number
app.listen(PORT, ()=>{
    console.log("App is running on PORT: " + PORT)
})