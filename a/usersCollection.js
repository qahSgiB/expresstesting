const Long = require('mongodb').Long;



var usersCollection;



function setDatabase(databaseX) {
    usersCollection = databaseX.collection('users');
}

async function addUser(newUser) {
    const lastId = (await usersCollection.find({}, {projection: {id: 1, _id: 0}}).sort({id: -1}).limit(1).toArray())[0].id;
    newUser.id = Long.fromInt(lastId+1);

    usersCollection.insertOne(newUser);
}

async function getUser(userId) {
    const user = await usersCollection.findOne({id: userId});

    return user
}

async function tryLogin(userMail, userPassword) {
    const user = await usersCollection.findOne({mail: userMail});

    var details = {};
    var loginSuccessful = true;

    if (user === null) {
        loginSuccessful = false;
        details.errorMessage = 'user_not_found';
    } else {
        if (user.password === userPassword) {
            details.user = user
        } else {
            loginSuccessful = false;
            details.errorMessage = 'wrong_password';
        }
    }

    return [loginSuccessful, details]
}



module.exports = {
    setDatabase: setDatabase,
    addUser: addUser,
    getUser: getUser,
    tryLogin: tryLogin,
}