const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/WebLamHai', {
            useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
        });
        console.log("connect sussessfully")
    } catch (error) {
        console.log("connect  error")
    }
}
module.exports = { connect }