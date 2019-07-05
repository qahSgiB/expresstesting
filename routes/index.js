var express = require('express');

const mongodb = require('../a/mongodb');
const booksCollection = require('../a/booksCollection');
const usersCollection = require('../a/usersCollection');
const sessionsCollection = require('../a/sessionsCollection');
const sessionManager = require('../a/sessionManager');



/* load database and set it for all modules that need it */
mongodb.loadDatabase(function(database) {
    booksCollection.setDatabase(database);
    usersCollection.setDatabase(database);
    sessionsCollection.setDatabase(database);
})


var router = express.Router();

/* GET home page */
router.get('/', async function(req, res, next) {
    res.render('main');
});

/* GET search page */
router.get('/search', async function(req, res, next) {
    const searchBook = req.query.search;
    const books = await booksCollection.findBooks(searchBook);

    res.render('search', {results: books, title: 'Search | "'+searchBook+'"'});
});

/* GET+POST signup page */
router.get('/user/signup', function(req, res, next) {
    res.render('user_signup', {notDisplayAccount: true});
});

router.post('/user/signedup', async function(req, res, next) {
    var newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        mail: req.body.mail,
        isic: req.body.isic,
        password: req.body.password,
    };
    usersCollection.addUser(newUser);

    res.redirect('/');
});

/* GET+POST login page */
router.get('/user/login', function(req, res, next) {
    var error = {};

    const errorX = req.query.error;
    if (errorX) {
        if (errorX === 'user_not_found') {
            error.message = 'User not found';
        } else if (errorX === 'wrong_password') {
            error.message = 'Wrong password';
            error.mail = req.query.mail;
        } else {
            error.message = 'Unknown server error';
        }
    }

    res.render('user_login', {notDisplayAccount: true, error: error});
});

router.post('/user/logedin', async function(req, res, next) {
    const mail = req.body.mail;
    const password = req.body.password;

    const [loginSuccessful, details] = await usersCollection.tryLogin(mail, password);

    if (loginSuccessful) {
        await sessionManager.login(req.locals.sid, details.user.id);

        res.redirect('/');
    } else {
        res.redirect('/user/login?error='+details.errorMessage+'&mail='+mail);
    }
});

/* GET logout page */
router.get('/user/logout', async function(req, res, next) {
    await sessionManager.logout(req.locals.sid);

    res.redirect('/');
});



module.exports = router;
