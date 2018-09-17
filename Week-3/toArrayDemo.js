const MongoClient = require('mongodb').MongoClient,
        assert    = require('assert');

MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, client) => {
    assert.equal(null, err);
    console.log('successfully connected to the server');
    
    var db = client.db('crunchbase');
    var query = { "category_code": "biotech" };
    
    db.collection('companies').find(query).toArray((err, docs) => { //toArray : get all docs in array form
        assert.equal(null, err);
        assert.notEqual(docs.length, 0);

        docs.forEach(doc => {
            console.log(doc.name + "=>" + doc.category_code);
        });
        client.close;
    });

});        
