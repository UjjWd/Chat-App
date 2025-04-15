const mongoose=require('mongoose'); 
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minlength:6,
        required:true
    },
    profilePic:{
        type:String,
        default:"",
    },

    
},{timestamps:true});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,12);
    next();
});
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
};
userSchema.methods.generateAccesstoken=async function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_ACCESS_EXPIRY});
};

userSchema.methods.updatePassword=async function(password){
    this.password=await bcrypt.hash(password,12);
    await this.save({validateBeforeSave:false});
}

const User=mongoose.model('User',userSchema);
module.exports=User;