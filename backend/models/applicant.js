var mongoose = require('mongoose')

const applicantSchema = new mongoose.Schema({

    name: String,
    email: String,
    password: String,
    education: [{id: Number, institute: String, start: Number, end: Number}],
    company: String,
    title: String,
    jobType: String,
    skills: [{id: Number, content: String}],
    rating: Number,
    numRating: Number,
    activeApplications: Number,
    employee: Number
})

applicantSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Applicant', applicantSchema)