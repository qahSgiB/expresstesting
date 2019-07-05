const Long = require('mongodb').Long;



var sessionsCollection;



function setDatabase(databaseX) {
    sessionsCollection = databaseX.collection('sessions');
}

function addSession(sid, userId) {
    var newSession = {
        sid: sid,
        user: Long.fromInt(userId),
    }

    sessionsCollection.insertOne(newSession);
}

async function getSession(sid) {
    const session = await sessionsCollection.findOne({sid: sid});

    return session;
}

async function setSessionUser(sid, newUser) {
    await sessionsCollection.updateOne({sid: sid}, {$set: {user: Long.fromInt(newUser)}});
}



module.exports = {
    setDatabase: setDatabase,
    addSession: addSession,
    getSession: getSession,
    setSessionUser: setSessionUser,
}