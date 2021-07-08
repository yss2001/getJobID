const express = require('express')
const cors = require('cors')
const moment = require('moment')

const Recruiter = require('../models/recruiter')
const Listing = require('../models/listing')
const Employee = require('../models/employee')
const Application = require('../models/application')
const Applicant = require('../models/applicant')

const router = express.Router()
const app = express()
app.use(cors());
app.use(express.json())


router.get('/profile', async (req, res) =>{

    await Recruiter.findOne({email: req.query.email}).then(recruiter => {
        res.json(recruiter)
    })
})

router.post('/createListing', async (req, res) =>{

    var count = 0
    await Listing.find({}, function(err, result){
        count = result.length
    })

    const record = await Recruiter.findOne({email: req.body.email})

    try {
        const listing = new Listing({
            title: req.body.title,
            name: record.name,
            email: req.body.email,
            maxApps: Number(req.body.maxApps),
            curApps: 0,
            curPos: 0,
            maxPos: Number(req.body.maxPos),
            postDate: moment().format("YYYY-MM-DD"),
            deadline: moment().set('year', req.body.dyear).set('month', req.body.dmonth-1).set('date', req.body.dday)
                              .set('hour', req.body.dhours).set('minute', req.body.dminutes).format("YYYY-MM-DDTHH:mm"),
            skills: req.body.skills,
            jobType: req.body.jobType,
            duration: Number(req.body.duration),
            salary: Number(req.body.salary),
            listID: Number(count+1),
            rating: 0,
            numRating: 0
        })
        listing.save(function(err){
            if(err)
                console.log(err)
        })
    }
    catch{
        res.status(500)
    }
})

router.get('/activeJobs', async (req, res) =>{

    await Listing.find().then(jobs => {
        let records = []

        for( job in jobs){
            if(jobs[job].email === req.query.email) {
                if(jobs[job].curPos !== jobs[job].maxPos)
                    records.push(jobs[job])
            }
        }
        res.json(records)
    })
})

router.get('/employees', async (req, res) => {

    const email = req.query.email

    await Employee.find({companyEmail: email}).then(emp => {
        res.json(emp)
    })
})

router.get('/applications', async (req, res) =>{

    const id = req.query.id
    await Application.find({listID: id}).then(app =>{
        res.json(app)
    })
})

router.put('/decideApp', async (req, res) => {

    const data = req.body.params.data
    const uid = req.body.params.uid
    const lid = req.body.params.lid
    const cid = req.body.params.cid

    await Application.findOneAndUpdate({userEmail: uid, listID: lid}, {$set: {status: data}})

    const user = await Applicant.findOne({email: uid})

    const job = await Listing.findOne({listID: lid})

    if(data === "Accepted")
    {
        let apps = await Application.find({userEmail: uid, listID: {$ne: lid}, $or: [{status: "Shortlisted"}, {status: "Applied"}]})

        let app 
        for(app in apps){
            await Listing.findOneAndUpdate({listID: apps[app].listID}, {$inc: {curApps: -1}})
        }
        await Application.updateMany({userEmail: uid, listID: {$ne: lid}}, {$set: {status: "Rejected"}})

        await Listing.findOneAndUpdate({listID: lid}, {$inc: {curPos: 1, curApps: -1}})

        let emp = new Employee({
            name: user.name,
            dateOfJoining: moment().format('YYYY-MM-DD'),
            jobType: job.jobType,
            title: job.title,
            listID: lid,
            email: user.email,
            companyEmail: cid,
            rating: -1,
            totalRating: user.rating,
        })

        await emp.save()

        await Application.updateMany({email: uid, listID: lid}, {$set: {dateOfJoining: moment().format('YYYY-MM-DD')}})

        await Applicant.findOneAndUpdate({email: uid}, {$set: {employee: 1, activeApplications: 0}})
    }

    if(data === "Rejected")
    {
        await Applicant.findOneAndUpdate({email: uid}, {$inc: {activeApplications: -1}})
        await Listing.findOneAndUpdate({listID: lid}, {$inc: {curApps: -1}})
    }
})

router.put('/rate', async (req, res) => {

    const rating = req.body.params.rating
    const uid = req.body.params.uid

    let user = await Applicant.findOne({email: uid})


    let r = Number(user.rating) + Number(rating)

    
    r = r / (user.numRating + 1)


    let newnum = user.numRating + 1
    
    await Applicant.findOneAndUpdate({email: uid}, {$set: {rating: r, numRating: newnum}})
    
    await Employee.findOneAndUpdate({email: uid}, {$set: {rating: rating, totalRating: r}})

    await Application.updateMany({email: uid}, {$set: {userRating: r}})
})

router.put('/updateProfile/:email', async (req, res) =>{

    const profile = req.body.params.profile
    const email = req.params.email

    await Recruiter.deleteOne({email: email})

    const record = new Recruiter(profile)

    record.save()
})

router.put('/updateListing', async (req, res) =>{

    const job = req.body.params.active

    //for(job in jobs){
        let newdate = moment().set('year', job.year).set('month', job.month-1).set('date', job.date).set('hour', job.hour).set('minute', job.minute)

        await Listing.findOneAndUpdate({listID: job.listID}, {$set: {
            maxPos: job.maxPos,
            maxApps: job.maxApps,
            deadline: newdate.format("YYYY-MM-DDTHH:mm")
        }})
    //}
})

router.put('/deleteListing', async (req, res) =>{

    const jid = req.body.params.jid
    let emp = await Employee.find({listID: jid})

    for(e in emp){
        await Applicant.findOneAndUpdate({email: emp[e].email}, {$set: {employee: 0}})
    }

    await Employee.deleteMany({listID: jid})

    let users = await Applicant.find()

    for(user in users){
        const app = await Application.findOne({userEmail: users[user].email, listID: jid})

        if(app){
            if(app.status !== 'Accepted' || app.status !== 'Rejected'){
                await Applicant.findOneAndUpdate({email: users[user].email}, {$inc: {activeApplications: -1}})
                await Application.deleteOne({userEmail: users[user].email, listID: jid})
            }
            else{
                await Application.deleteOne({userEmail: users[user].email, listID: jid})
            }
        }
    }

    await Listing.deleteOne({listID: jid})

    let jobs = await Listing.find()

    for(job in jobs){
        if(jobs[job].listID > jid){
            await Listing.findOneAndUpdate({listID: jobs[job].listID}, {$inc: {listID: -1}})
            await Application.updateMany({listID: jobs[job].listID}, {$inc: {listID: -1}})
            await Employee.updateMany({listID: jobs[job].listID}, {$inc: {listID: -1}})
        }
    }

})

module.exports = router