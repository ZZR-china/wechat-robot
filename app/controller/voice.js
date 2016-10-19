/*
 * Author: MagicZhang <magic@foowala.com>
 * Module description: 语音路由
 */

var router = require('express').Router(),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    request = require('request'),
    voice_service = require('../service/voice.service'),
    voice_upload = require('../helpers/upload.voice'),
    token = require('../helpers/tokenDb'),
    async = require('async'),
    message = require('../helpers/message');

router.route('/voice')
    .get(function(req, res, next) {
        voice_service.getVoice(function(voices){
            var arr = [];
            res.render('voice', {
                voices:voices
            });

        })
    })
    .post(function(req, res, next) {
        token.getToken(function(err, token) {
            var mediaId = req.body.voice,
                openid = req.body.openid,
                phonetype = req.body.phonetype,
                msg = new message(),
                voice = {},
                filenames = [];
            if (err) {
                return callback(err, null)
            }
            if (mediaId !== null) {
                async.each(mediaId, function(id, next) {
                    var options = {
                        url: 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + token + '&media_id=' + id
                    };
                    var id = new Date().getTime();
                    // var voicestream = request(options.url);
                    var voiceurl = options.url;
                    voice_upload.storeVoice(id.toString(), phonetype, 'foowala.voice', voiceurl, function(filename) {
                        filenames.push(filename);
                        console.log(2);
                        console.log(filename + 'is save in s3');
                        next();
                    });
                }, function(err) {
                    if (err) {
                        console.log('A file failed to process');
                        msg.msg = '上传失败';
                        msg.status = 0;
                        res.send(msg)
                    } else {
                        console.log('All files have been processed successfully');
                        console.log(typeof voice)
                        voice.open_id = openid;
                        voice.status = 0;
                        voice.filename = filenames;
                        console.log('voice',voice)
                        voice_service.saveVoice(voice, function(err) {
                            if (err) {
                                throw err
                            }
                            console.log('save successfully')
                            msg.msg = '上传成功';
                            msg.status = 1;
                            res.send(msg)
                        })
                    }
                })
            }
        })
    })

module.exports = function(app) {
    app.use('/', router);
};
