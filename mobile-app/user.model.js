const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type:String, required: true},
    email: {type:String, required: true, unique: true},
    age: {type:Number, default: null},
    password: {type:String, required: true}

},{ collection: 'Users' });

const UserModel = mongoose.model('Users', userSchema);

module.exports = UserModel;