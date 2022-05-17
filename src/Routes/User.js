const {Router} = require("express")
const User = require("../Model/User")
const route = Router();
const jwt = require("jsonwebtoken")

//Handles both login and signup
route.post('/login', async(req,res)=>{
    try{
        const { email, password} = req.body;
        const userRev = await User.findByCredentialsOrCreate(email, password);
        const token = await userRev.generateAuthToken();
        res.cookie('authToken',token, { maxAge: 900000, httpOnly: true });
        return res.send({ success: 1});
    }catch(e){
        return res.send(e);
    }
})

//Handles logout func.
route.delete("/logout", async(req,res)=>{
    try{
        const cookie = req.headers.cookie.split("authToken=")[1];
        if(!cookie){
           throw new Error("Invalid session") 
        }
        const decoded = jwt.verify(cookie, "netflix_clone");
        const user = await User.findById(decoded._id);
        if(!user){
            throw new Error("Invalid session")
        }
        const rest_tokens = user.tokens.filter(tokenObj => {
            if(tokenObj.token !== cookie){
                return token};})

        user.tokens = rest_tokens
        await user.save();
        res.clearCookie("authToken")
        return res.send({ success:1})
    }catch(e){
        console.log(e)
        return res.status(401).send(e)
    }
})


//Generates Reset password
route.post("/restPwd", async(req,res)=>{
    try{
        const {link} = await User.recoverPassword(req.body.email);
        return res.send({link: link, success: 1});
    }catch(e){
        console.log(e)
        return res.status(400).send()
    }
})

//Handles resetted pwd
route.patch("/reset-password/:token", async(req,res)=>{
    try{
        await User.resetPassword(req.params.token, req.body.password)
        return res.send({success:1})
    }catch(e){
    console.log(e)
    return res.status(400).send()    
    }
})


module.exports = route;