'use strict'

require('dotenv').config()

const express = require('express')
const app = express()

const port = process.env.PORT || 3060
const path = require('path')
const hbs = require('express-handlebars')
const session = require('express-session')
const cors = require('cors')

app.use(express.static(__dirname + '/public'))
app.use('/media', express.static(__dirname + '/media'))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20 * 60 * 1000 // 20 minutes
    }
});
app.use(sessionMiddleware)

const allowedOrigins = process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
const corsConfig = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
};
app.use(cors(corsConfig));

app.engine('hbs', hbs.engine({
    extname: '.hbs',
    defaultLayout: 'app',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.use(require('./routes'))

app.use((req, res, next) => {
    res.status(404).render('errorPage', {
        layout: 'single',
        title: "404 Error",
        message: 'Page Not Found'
    })
})
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('errorPage', {
        layout: 'single',
        title: "500 Error",
        message: 'Internal server error.'
    })
})

const { setupWebSocket } = require('./websocket')
setupWebSocket(app, sessionMiddleware, corsConfig)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

