'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var fs = require('fs');
var formidable = require('formidable');
var http = require('http');
var path = require('path');
var request = require('request');
var config = require('../config');


var mp3url = 'http://7xrwoa.com1.z0.glb.clouddn.com/first.mp3';

var options = {
    // url: 'https://api.github.com/repos/mikeal/request',
    url: mp3url,
    headers: {
        'User-Agent': 'request'
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        // var info = JSON.parse(body);
        // console.log(info.stargazers_count + " Stars");
        // console.log(info.forks_count + " Forks");
        console.log(typeof body)
    }
}


router.route('/voice')
    .get(function(req, res, next) {
        var filePath = path.join(config.rootname + '/tem/');
        var fileName = new Date().getTime() + '.mp3';
        var writeoption = filePath + fileName;
        console.log(writeoption)
        var writer = fs.createWriteStream(writeoption, { start: 0 })
        if (!fs.existsSync(filePath)) {
            fs.mkdir(filePath);
        }
        request(options, callback)
            .pipe(writer)
            .on('finish', () => {
                console.log('write is done')
            });
        res.render('voice', {});
    })
    .post(function(req, res, next) {
        var url = 'http://7xrwoa.com1.z0.glb.clouddn.com/first.mp3';

        http.get(url, function(res) {
            console.log("Got response: 1" + res.statusCode);
        }).on('err', function(e) {
            console.log("Got error: " + e.message);
        })

        res.send('success');
    })

router.route('/upload')
    .post(function(req, res, next) {
        var form = new formidable.IncomingForm();

        form.uploadDir = path.join(__dirname, 'voicetmp'); //文件保存的临时目录为当前项目下的tmp文件夹
        form.maxFieldsSize = 20 * 1024 * 1024; //用户头像大小限制为最大20M
        form.keepExtensions = true; //使用文件的原扩展名
        form.parse(req, function(err, fields, file) {
            var filePath = '';
            if (file.temFile) {
                filePath = file.temFile.path;
            } else {
                for (var key in file) {
                    if (file[key].path && filePath === '') {
                        filePath = file[key].path;
                        break;
                    }
                }
            }
            var targetDir = path.join(__dirname, 'upload');
            if (!fs.existsSync(targetDir)) {
                fs.mkdir(targetDir);
            }
            var fileExt = filePath.substring(filePath.lastIndexOf('.'));
            if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
                var err = new Error('此文件类型不允许上传');
                res.json({ code: -1, message: '此文件类型不允许上传' });
            } else {
                //以当前时间戳对上传文件进行重命名
                var fileName = new Date().getTime() + fileExt;
                var targetFile = path.join(targetDir, fileName);
                //移动文件
                fs.rename(filePath, targetFile, function(err) {
                    if (err) {
                        console.info(err);
                        res.json({ code: -1, message: '操作失败' });
                    } else {
                        //上传成功，返回文件的相对路径
                        var fileUrl = '/upload/' + fileName;
                        res.json({ code: 0, fileUrl: fileUrl });
                    }
                });
            }
        })
    })

router.route('/text')
    .get(function(req, res, next) {
        fs.writeFile("my.txt", "Javascript很赞", function(err) {
            if (!err)
                console.log("写入成功！")

        })

        var txt = "大家要好好学习NodeJS啊！！";
        fs.writeFile('my1.txt', txt, function(err) {
            if (err) {
                throw err
            }
            console.log('my1 txt save success');

        })

        fs.readFile("MY1.txt", "utf8", function(error, data) {
            if (error) throw error;
            res.send(data);
        });

        fs.unlinkSync('my1.txt');
        console.log('successfully deleted my1.txt');

    })

router.route('/file')
    .get(function(req, res, next) {
        const filePath = path.join(__dirname, './');
        console.log(filePath)
        fs.readdir(filePath, function(err, results) {
            if (err) {
                throw err
            }
            if (results.length > 0) {
                var files = [];
                results.forEach(function(file) {
                    if (fs.statSync(path.join(filePath, file)).isFile()) {
                        files.push(file)
                    }
                })
                res.render('file', { files: files })
            } else {
                res.end('当前目录下没有文件');
            }
        });

    })

router.route('/file/:filename')
    .get(function(req, res, next) {
        // 实现文件下载
        var fileName = req.params.filename;
        console.log(fileName)
        var filePath = path.join(__dirname, fileName);
        console.log(filePath)
        var stats = fs.statSync(filePath);
        if (stats.isFile()) {
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename=' + fileName,
                'Content-Length': stats.size
            });
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.end(404);
        }
    });



module.exports = function(app) {
    app.use('/', router);
};
