const crypto = require('crypto');

const sessionsCollection = require('../a/sessionsCollection');
const getUser = require('../a/usersCollection').getUser;



function createSession(userId) {
    var sidX = crypto.createHash('sha256');
    sidX.update(Math.random().toString());

    var sid = sidX.digest('hex');
    sessionsCollection.addSession(sid, userId);

    return sid;
}

async function sessionMidlleware(req, res, next) {
    var sid = req.cookies.sid;

    if (sid === undefined) {
        sid = createSession(-1);
    }

    res.cookie('sid', sid, {maxAge: 365*24*60*60*1000});

    const user = await getSessionUser(sid);
    req.locals.sid = sid;
    req.locals.user = user;
    res.locals.user = user;

    next();
}

async function getSessionUser(sid) {
    const session = await sessionsCollection.getSession(sid)
    const user = session.user === -1 ? undefined : (await getUser(session.user));

    return user
}

async function login(sid, newUser) {
    sessionsCollection.setSessionUser(sid, newUser);
}

async function logout(sid) {
    sessionsCollection.setSessionUser(sid, -1);
}



module.exports = {
    sessionMidlleware: sessionMidlleware,
    getSessionUser: getSessionUser,
    login: login,
    logout: logout,
}