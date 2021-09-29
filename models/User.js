const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
        max: 50
    },
    city:{
        type: String,
        max: 50
    },
    from:{
        type: String,
        max: 50
    },
    relationship:{
        type:Number,
        enum:[1,2,3]
    }
},

    { timestamps: true });
//to craete the record 

//Export the model
module.exports = mongoose.model('User', userSchema);