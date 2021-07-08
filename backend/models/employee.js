var mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({

    name: String,
    dateOfJoining: String,
    jobType: String,
    title: String,
    listID: Number,
    email: String,
    companyEmail: String,
    rating: Number,
    totalRating: Number //same as the rating in Applicant, used for sorting by Recruiter
})

//employeeSchema.index({email:1}, {unique: true})

employeeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Employee', employeeSchema)