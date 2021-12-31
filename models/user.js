const mongoose = require("mongoose");
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true
    },
    lastName:{
        type:String,
        trim:true
    },
    age:{
        type:Number,
        trim:true,
    },
    email:{
        type:String,
        required: true,
        unique:true,
        trim: true
    },
    encry_password:{
        type:String,
        required: true
    },
    salt:{
        type:String
    },
    role:{
        type:Number,
        default:0
    },
    purchases:{
        type:Array,
        default: []
    }

},{timestamps:true});

userSchema.virtual("password")
        .get(function(){
            return this._password;
        })
        .set(function(password){
            this._password = password;
            this.salt = uuidv1();
            this.encry_password = this.securePassword(password)
        })


userSchema.methods = {
    authenticate :function(plainPassword) {
        return this.securePassword(plainPassword) === this.encry_password
    },
    toJSON: function (){
        const user = this;
        const userObject  = user.toObject()

        delete userObject.salt;
        delete userObject.encry_password

        return userObject;
    },
    securePassword: function(plainPassword){
        if(!plainPassword) return ""
        try {
            return crypto.createHmac('sha256', this.salt)
            .update(plainPassword)
            .digest('hex');
        } catch (error) {
         return error   
        }
       
    }
}

module.exports = mongoose.model("User",userSchema);