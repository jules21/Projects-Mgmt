const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// client

const ClientSchema = new Schema({
    name: {type:String},
    email: {type:String},
    phone: {type:String},
})

module.exports = mongoose.model('Client', ClientSchema)