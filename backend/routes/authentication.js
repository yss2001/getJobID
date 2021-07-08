const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Applicant = require('../models/applicant')
const Recruiter = require('../models/recruiter')

const router = express.Router()
const app = express()
app.use(cors());
app.use(express.json())


router.post('/applicantSignIn', async (req, res) => {

    const applicant = await Applicant.findOne({ email: req.body.email })

    if (applicant === null || typeof record === undefined) {
        res.send('FAIL')
    }
    else {
        try {
            if (await bcrypt.compare(req.body.password, applicant.password)) {
                res.send('SUCCESS')
            }
            else {
                res.send('FAIL')
            }
        }
        catch{
            res.send('FAIL')
        }
    }

})

router.post('/recruiterSignIn', async (req, res) => {

    const recruiter = await Recruiter.findOne({ email: req.body.email })
    if (recruiter === null || typeof record === undefined) {
        res.send('FAIL')
    }
    else {
        try {
            if (await bcrypt.compare(req.body.password, recruiter.password)) {
                res.send('SUCCESS')
            }
            else {
                res.send('FAIL')
            }
        }
        catch{
            res.send('FAIL')
        }
    }
})

router.post('/applicantRegister', async (req, res) => {

    const record = await Applicant.findOne({ email: req.body.email })
    if (record === null || typeof record === undefined) {
        try {
            const hash = await bcrypt.hash(req.body.password, 10)
            const applicant = new Applicant({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                education: req.body.education,
                skills: req.body.skills,
                company: '',
                title: '',
                jobType: '',
                rating: 0,
                numRating: 0,
                activeApplications: 0,
                employee: 0
            })

            await applicant.save()
            res.send('SUCCESS')
        }
        catch{
            res.status(500).send('FAIL')
        }
    }
    else {
        res.send('FAIL')
    }
})

router.post('/recruiterRegister', async (req, res) => {

    const record = await Recruiter.findOne({ email: req.body.email })
    if (record === null || typeof record === undefined) {
        try {
            const hash = await bcrypt.hash(req.body.password, 10)
            const recruiter = new Recruiter({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                contact: req.body.contact,
                bio: req.body.bio
            })

            await recruiter.save()
            res.send('SUCCESS')
        }
        catch{
            res.status(500).send('FAIL')
        }
    }
    else {
        res.send('FAIL')
    }
})

module.exports = router