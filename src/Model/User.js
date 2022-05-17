const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    resetPasswordToken: {
        type: String
    },
}, {timestamps: true})

userSchema.statics.findByCredentialsOrCreate = async(email ,password) => {
    let user = await User.findOne({email})

    if(!user){
      user = new User({email, password})
       console.log(user)
      user = await user.save()
      return user
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error("Invalid Password")
    }

    return user
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, "netflix_clone" , {expiresIn: '3h'})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token 
}


userSchema.statics.recoverPassword = async (email) => {
    try{
        const user = await User.findOne({email})
        if(!user){throw new Error()}
        let token = jwt.sign({id: user._id, email: user.email}, "netflix_clone", {expiresIn: 600000})
        user.resetPasswordToken = token
        await user.save()
        return ({link: `users/reset-password/${token}`, email: user.email})
    }catch(e){
        return ({error: 'cant reset password now, Please try again later'})
    }
}

userSchema.statics.resetPassword = async (token , password) => {
    try{
        const decoded = jwt.verify(token, "netflix_clone")
        const user = await User.findOne({_id:decoded.id, email: decoded.email})
        if(!user){throw new Error()}
        if(!user.resetPasswordToken){throw new Error()}
        user.password = password
        user.resetPasswordToken = undefined
        user.tokens = []
        await user.save()
    }catch(e){
        throw new Error()
    }
    
}


userSchema.pre('save',async function (next){
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 12)
    }
    next()
} )

const User = mongoose.model('User', userSchema)

module.exports = User
