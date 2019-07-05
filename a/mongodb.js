const MongoClient = require('mongodb').MongoClient;



function loadDatabase(callback) {
    MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser: true}, function(error, result) {
        console.log('[MongoDB] connection to \'localhost:27017\' established')

        database = result.db('books');

        callback(database)
    });
}



module.exports.loadDatabase = loadDatabase;