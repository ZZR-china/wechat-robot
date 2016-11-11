/*
 * Author: MagicZhang <magic@foowala.com>
 * Module description: Voice Module
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    voice_Schema = new Schema({
        open_id: String,
        filename: [String],
        createTime: Date,
        status:Number
    });

voice_Schema.virtual('date').get(function() {
    this._id.getTimestamp();
});

voice_Schema.pre('save', function(next) {
    next();
});

voice_Schema.statics = {
    findById: function(id, callback) {
        return this.findOne({ _id: id }, function(err, voice) {
            callback(voice);
        });
    }
};

var voice = mongoose.model('voice', voice_Schema);

module.exports = exports = voice
