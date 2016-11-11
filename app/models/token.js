var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema,
    token_Schema = new Schema({
        access_token: String,
        expires_in  : Number,
        createTime  : {type: Date, default: Date.now }
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

module.exports = exports = token
