var mongoose = require('mongoose');

var mongourl = process.env.mongo;

if (mongourl) {
    mongoose.connect(mongourl, { server: { socketOptions: { keepAlive: 1 } } });
} else {
    const setting = require('../../config/private');
    const localurl = setting.url;
    mongoose.connect(localurl, { server: { socketOptions: { keepAlive: 1 } } });
}

mongoose.set('debug', true);

//connect mongoose
var db = mongoose.connection;
db.on('error', function() {
    console.log('mongo open error')
})
db.once('open', function() {
    console.log('mongo opened');
})

module.exports = db;
