var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema,
    token_Schema = new Schema({
        _id         : Number,
        errcode     : Number,
        errmsg      : String,
        ticket      : String,
        access_token: String,
        expires_in  : Number,
        lastUpdated : String
    });

token_Schema.pre('save', function(next) {
  next();
});

token_Schema.statics = {
  findById: function(id, callback) {
    return this.findOne({_id: id}, function(err, token) {
      callback(token);
    });
  }
};

var token = mongoose.model('token', token_Schema, "token");

module.exports = token
