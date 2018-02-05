const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');


// Globals
const port = 3000;
var app = express();

// Static Path
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/services', (req, res) => {
    res.render('services');
});

// Handle contact from post data
app.post('/contact', (req, res) => {
    // Setup smtp mailer
    var mailOpts, smtpTrans;

    console.log(req.body);

    // Setup nodemailer transe (Gmail), app specific account should be created
    smtpTrans = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: "gvader.mailto@gmail.com",
            pass: "gv@Gvader4cash"
        }
    });

    // Mail opts
    mailOpts = {
        from: req.body.name + "&lt;" + req.body.email + "&gt;", // from request body object
        to: "lukasz.gwadera@gmail.com",
        subject: "Website Contact",
        text: req.body.message + ' || FROM:' + req.body.name + ' || EMAIL:' + req.body.email 
    };

    smtpTrans.sendMail(mailOpts, (error, info) => {
        // Email not sent
        if (error) {
            console.log(error);
            req.render('services.html', {
                title: 'Gvader Inc. | Services',
                page: 'services',
                type: 'error',
                description: 'Email not sent correctly'
            });
        } else {
            res.render('services.html', {
                title: 'Gvader Inc. | Services',
                page: 'services',
                type: 'success',
                description: 'Email sent successfully'
            })
        }
    })
});

app.listen(port, () => {
    console.log("Server started at port " + port);
})
