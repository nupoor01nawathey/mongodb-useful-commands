const MongoClient = require('mongodb').MongoClient,
        assert    = require('assert');

MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, client) => {
    assert.equal(null, err);
    console.log('successfully connected to the server');
    
    var db = client.db('crunchbase');
    var query = { "category_code": "biotech" };
    var cursor = db.collection('companies').find(query);

    cursor.forEach(doc => {
        console.log(doc.name + '=>' + doc.category_code);
    }, err => {
        assert.equal(err, null);
        return client.close();
    });
});    

// we are not extracting all data at once instead we are streaming it to out application as we need them
// here we are looping over CURSOR of some bacth size not the entire array as in case of toArray example
// toArray => looping over entire array
// forEach => process as cursor batch comes in, faster than toArray