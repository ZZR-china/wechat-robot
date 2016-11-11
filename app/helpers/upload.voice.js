/*
 * Author: MagicZhang <magic@foowala.com>
 * Module description: 图片上传亚马逊方法
 */

var async = require('async'),
    dateTime = require('./dateTime'),
    secret = require('../../config/secret'),
    request_https = require('request'),
    AWS = require('aws-sdk'),
    shortid = require('shortid');

AWS.config.region = 'cn-north-1';
if (process.env.online) {
    AWS.config.accessKeyId = process.env.accessKey;
    AWS.config.secretAccessKey = process.env.secretKey;
}else{
    AWS.config.accessKeyId = secret.AWS.accessKey;
    AWS.config.secretAccessKey = secret.AWS.secretKey;
}

/**
 * 向亚马逊提交语音
 * @param  {[type]}   id         [filename]
 * @param  {[type]}   bucketName [亚马逊的图片库]
 * @param  {[type]}   voiceArray [stream]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
function storeVoice(id, phonetype, bucketName, voiceurl, callback) {

    var s3Stream = require('s3-upload-stream')(new AWS.S3()),
        uploadKey;
    if (phonetype === 0) {
      uploadKey = id + "_" + shortid.generate() + ".aud";
    }else{
      uploadKey = id + "_" + shortid.generate() + ".amr";
    }
    var upload = s3Stream.upload({
            "Bucket": bucketName,
            "Key": uploadKey
        });

    upload.maxPartSize(20971520); // 20 MB
    upload.concurrentParts(5);

    upload.on('error', function(error) {
        console.error(dateTime.timeShanghai() + ' - ERROR - s3Stream.upload - Cannot upload voice to S3: ' + uploadKey);
        console.log(error);

    });

    upload.on('part', function(details) {
        console.log(details);
    });

    upload.on('uploaded', function(details) {
        console.log(dateTime.timeShanghai() + ' - Successfully uploaded following voice to Amazon S3: ' + uploadKey);
        console.log(details);
    });

    request_https(voiceurl).pipe(upload);

    return callback(uploadKey);
}

/**
 * 从亚马逊服务器获取voice
 * @param  {[type]}   bucketName [description]
 * @param  {[type]}   imageArray [filename array]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
function getVoiceUrls(bucketName, voice, callback) {
    var s3 = new AWS.S3(),
        params = { Bucket: bucketName, Key: voice };

    s3.getSignedUrl('getObject', params, function(err, url) {
        if (err) {
            return callback('');
        } else {
            return callback(url);
        }
    });
}
/**
 * 从亚马逊删除语音
 * @param  {[type]}   id         [description]
 * @param  {[type]}   bucketName [description]
 * @param  {[type]}   voiceArray [description]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
function deleteVoice(id, bucketName, voiceArray, callback) {
    if (voiceArray.length > 0) {
        //Pass in bucketName, for each item in the photos array, perform the asynchronous operation.
        async.each(voiceArray, function(file, callback) {

            var s3 = new AWS.S3(),
                params = { Bucket: bucketName, Key: file };

            s3.deleteObject(params, function(err, data) {
                if (err) {
                    return callback(err);
                } else {
                    console.log("The Object is deleted from Amazon S3: " + file);
                }
            });
        }, function(err) {
            if (err) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.error(dateTime.timeShanghai() + ' - ERROR - deleteImage encountered error deleting images from Amazon S3');
                console.error(err);
                return callback(err, null);
            } else {
                console.log("YOU ROCK! Deleted all photos from Amazon S3 and MongoDB!");
                return callback(null, null);
            }
        });
    } else {
        console.log("NO IMAGES TO BE DELETED DETECTED");
        return callback(null, null);
    }
}

module.exports.deleteVoice = deleteVoice;
module.exports.storeVoice = storeVoice;
module.exports.getVoiceUrls = getVoiceUrls;
