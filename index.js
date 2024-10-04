'use strict'

require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 3060
const path = require('path')
const hbs = require('express-handlebars')
const session = require('express-session')


app.use(express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret:  process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20 * 60 * 1000
    }
}))

app.engine('hbs', hbs.engine({
    extname: '.hbs',
    defaultLayout: 'app',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',


}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.use(require('./routes'))

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
