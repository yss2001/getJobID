var mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({

    userEmail: String,
    name: String,
    companyEmail: String,
    listID: Number,
    sop: String,
    status: String,
    dateOfJoining: String,
    title: String,
    salary: Number,
    companyName: String,
    dateOfApp: String,
    rating: Number,
    userRating: Number
})

//applicationSchema.index({userID:1, companyID:1, listID:1}, {unique: true})

applicationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Application', applicationSchema)