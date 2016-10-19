/*
 * Author: MagicZhang <magic@foowala.com>
 * Module description: Voice Module
 */

var config = require('../../config/config'),
    mongoose = require('mongoose'),
    voice_mongo = require('../models/voice'),
    objectid = require('objectid'),
    dateTime = require('../helpers/dateTime');

var voiceModule = {
    getVoice: function(callback) {
        voice_mongo.find({}, function(err, voice) {
            return callback(voice);
        });
    },
    saveVoice: function(voice, callback) {
        voice = new voice_mongo({
            filename: voice.filename,
            open_id: voice.open_id,
            status: voice.status,
            createTime: dateTime.timeShanghai()
        });
        voice.save(function(err) {
            if (err) throw err;
            return callback();
        });
    },
};

module.exports = voiceModule;
