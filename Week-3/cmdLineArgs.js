const MongoClient = require('mongodb').MongoClient,
        assert    = require('assert'),
commandLineArgs   = require('command-line-args');

var options       = commandLineOptions();

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
    assert.equal(null, err);
    console.log('successfully connected to the server');

    var db          = client.db('crunchbase');
    var query       = queryDocument(options);
    var projection  = { "_id":0, "name":1, "founded_year":1, "number_of_employees":1, "crunchbase_url": 1, "overview": 1 };
    var cursor      = db.collection('companies').find(query, projection);
    var numMatches  = 0;

    cursor.forEach(doc => {
        numMatches++;
        console.log(doc);
    }, err => {
        console.log(`Our query was` + JSON.stringify(query));
        console.log(`Number of matching documents: ${numMatches}`);
        return client.close();
    });

});

function commandLineOptions() {
    var cli = [
        { name: "firstYear", alias:"f", type:Number },
        { name: "lastYear", alias:"l", type: Number },
        { name: "employees", alias: "e", type: Number },
        {name: "overview", alias: "o"}
    ];
    var options = commandLineArgs(cli);
    if( !("firstYear" in options ) && !("lastYear" in options )) {
        console.log({
            title: "Usage",
            description: "FirstYear and lastYear are mandatory params"
        });
        process.exit();
    }
    return options;
}


function queryDocument(options) {
    console.log(options);
    var query = {
        "founded_year": {
            "$gte": options.firstYear,
            "$lte": options.lastYear
        }
    };
    if("employees" in options) {
        query.number_of_employees = { "$gte": options.employees } ; // as e is not compulsory attach it to query obj only when specified in input
    }
    if("overview" in options) {
        query.overview = { "$regex": options.overview, "$options": "i" } ; // case insesitive matching
    }
    return query;
}
