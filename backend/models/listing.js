var mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({

    title: String,
    name: String,
    email: String,
    maxApps: Number,
    curApps: Number,
    curPos: Number,
    maxPos: Number,
    postDate: String,
    deadline: String,
    skills: [{id: Number, content: String}],
    jobType: String,
    duration: Number,
    salary: Number,
    listID: Number,
    rating: Number,
    numRating: Number
})

//listingSchema.index({companyID:1, listID:1}, {unique: true})

listingSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Listing', listingSchema)