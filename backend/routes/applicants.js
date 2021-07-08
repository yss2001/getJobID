const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const moment = require('moment')

const Applicant = require('../models/applicant')
const Listing = require('../models/listing')
const Application = require('../models/application')


const router = express.Router()
const app = express()
app.use(cors());
app.use(express.json())


router.get('/profile', async (req, res) => {
    await Applicant.findOne({ email: req.query.email }).then(applicant => {
        res.json(applicant)
    })
})

router.get('/listings', async (req, res) => {
    let records = await Listing.find()
    let modif1 = records
    if (req.query.search !== '') {
        modif1 = records.filter(record => record.title.includes(req.query.search))
    }


    let modif = modif1.filter(record => moment(record.deadline, "YYYY-MM-DDTHH:mm").isAfter(moment()))

    


    let applied = []
    var app
    if (req.query.email != '') {
        let apps = await Application.find({ userEmail: req.query.email })

        let index = 0

        for (record in modif) {
            applied.push(0)
            for (app in apps) {
                if (modif[record].listID === apps[app].listID) {
                    applied[index] = 1
                    break
                }
            }
            index += 1
        }
    }
   
    res.json({
        jobs: modif,
        applied: applied
    })
})

router.get('/myapps', async (req, res) => {
    const email = req.query.email

    let apps = await Application.find({ userEmail: email })

    let app

    for (app in apps) {
        if (apps[app].status !== "Rejected" && apps[app].status !== "Accepted") {
            const job = await Listing.findOne({ listID: apps[app].listID })
            if (job.curPos === job.maxPos) {
                await Application.updateOne({ userEmail: apps[app].userEmail, listID: apps[app].listID }, { $set: { status: "Rejected" } })
                await Applicant.updateOne({ email: apps[app].userEmail }, { $inc: { activeApplications: -1 } })
            }
        }
    }
    await Application.find({ userEmail: email }).then(app => {
        res.json(app)
    })

})

router.put('/updateProfile/:email', async (req, res) => {

    const profile = req.body.params.profile
    const email = req.params.email
    const edu = req.body.params.edu
    const skills = req.body.params.skills

    await Applicant.findOneAndUpdate({ email: email },
        { $set: { name: profile.name, email: profile.email, education: edu, skills: skills } })

})

router.put('/rate', async (req, res) => {

    const rating = req.body.params.rating
    const lid = req.body.params.lid
    const uid = req.body.params.uid

    let job = await Listing.findOne({ listID: lid })

    let r = Number(job.rating) + Number(rating)

    console.log('before', r)
    r = r / (job.numRating + 1)

    let newnum = job.numRating + 1
    console.log('after', r)



    await Listing.findOneAndUpdate({ listID: lid }, {$set: { rating: r, numRating: newnum }})

    await Application.findOneAndUpdate({ listID: lid, userEmail: uid }, {$set: { rating: rating }})
})


router.post('/apply', async (req, res) => {

    const uid = req.body.params.uid
    const jid = req.body.params.jid

    let user = await Applicant.findOne({ email: uid })

    let list = await Listing.findOne({ listID: jid })


    const app = new Application({
        userEmail: uid,
        name: user.name,
        companyEmail: list.email,
        listID: jid,
        sop: req.body.params.sop,
        status: "Applied",
        dateOfJoining: "",
        title: list.title,
        salary: list.salary,
        companyName: list.name,
        dateofApp: moment().format("YYYY-MM-DD"),
        rating: -1,
        userRating: user.rating
    })

    app.save()

    await Listing.findOneAndUpdate({ listID: jid }, { $inc: { curApps: 1 } })
    await Applicant.findOneAndUpdate({ email: uid }, { $inc: { activeApplications: 1 } })

})

module.exports = router