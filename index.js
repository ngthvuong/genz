'use strict'

const express = require('express')
const app = express()
const port = process.env.PORT || 3060
const path = require('path')
const hbs = require('express-handlebars')

app.use(express.static(__dirname + '/public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
