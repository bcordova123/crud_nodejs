const mongoose = require('mongoose');
const bcript = require('bcryptjs');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required: true},
    date:{type:Date, default:Date.now}
});

UserSchema.method.encryptPassword = async (password) => {
    await bcript.genSalt(10);
}

module.exports = mongoose.model('Users', UserSchema)