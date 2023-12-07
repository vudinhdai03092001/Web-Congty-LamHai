const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AccountSchema = new Schema({

    username: { type: String, maxLenght: 255 },
    password: { type: String, maxLenght: 255 },
    email: { type: String, maxLenght: 255 },
    role: { type: Number },
});


module.exports = mongoose.model('accounts', AccountSchema)