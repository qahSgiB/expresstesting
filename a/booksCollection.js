var booksCollection;



function setDatabase(databaseX) {
    booksCollection = databaseX.collection('books');
}

async function findBooks(searchBook) {
    function isResult(book) {
        return true;
        // return book === searchBook;
    }

    var booksFound = [];

    const books = await booksCollection.find({}).toArray();

    for (var book of books) {
        if (isResult(book)) {
            booksFound.push(Object.assign(book));
        }
    }
    
    return booksFound;
}



module.exports = {
    findBooks: findBooks,
    setDatabase: setDatabase,
}