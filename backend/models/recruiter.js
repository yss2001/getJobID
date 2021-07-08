var mongoose = require('mongoose')

const recruiterSchema = new mongoose.Schema({

    name: String,
    email: String,
    password: String,
    contact: String,
    bio: String
})

recruiterSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Recruiter', recruiterSchema)