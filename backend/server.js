const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const app = express()
app.use(cors());
app.use(express.json())

const users = []

mongoose.connect('mongodb://localhost/webDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
        .catch((error) => console.log(error))

app.use('/authenticate', require('./routes/authentication'))
app.use('/applicants', require('./routes/applicants'))
app.use('/recruiters', require('./routes/recruiters'))

app.listen(3001)

