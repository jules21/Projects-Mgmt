const mongoose = require('mongoose');
const Schema = mongoose.Schema

//project Schema

const ProjectSchema = new Schema({
    name:{type:String},
    description:{type:String},
    status:{
        type:String,
        enum: ['In Progress', 'Completed','Not Started']
    },
    ClientId:{
        type:Schema.Types.ObjectId,
        ref:'Client'
    },
})

module.exports = mongoose.model('Project', ProjectSchema);