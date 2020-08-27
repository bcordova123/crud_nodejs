const mongoose = require('mongoose');
const bcript = require('bcryptjs');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required: true},
    date:{type:Date, default:Date.now}
});

UserSchema.methods.encryptPassword = async (password) => {
   const salt = await bcript.genSalt(10);
   const hash = bcript.hash(password,salt);
   return hash;
};
UserSchema.methods.matchPassword = async function (password) {
    return await bcript.compare(password, this.password)
};

module.exports = mongoose.model('Users', UserSchema);