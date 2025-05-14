const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    fullName:{
        type: String,
        required: [true, "Please add a name"]
    },

    email:{
        type: String,
        required:[true, "Please provide your email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid emaial",
          ],
    },
    password:{
        type: String,
        required:[true, "please add you password"],
        minLength:[6, "password must be at least 6 charchter"],
    },
   
    phone:{
        type: String,
        default: "+251"
    },
    avatar: {
        type: String,
        default: ""
    },
    status:{
        type:Boolean,
        default:true
    },
    role_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role",
        required: [true, "Role is required"]
    },
    department_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department",
        // Will be validated at the controller level based on role
    },
    is_Admin:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next()
    }
    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password,salt)
    this.password = hashedPassword;
    next();

})

const User = mongoose.model('User', userSchema);


module.exports = User;