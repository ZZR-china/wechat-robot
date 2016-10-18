'use strict';
var AV = require('leanengine');

var express,
    config,
    glob,
    mongoose,
    models,
    app;


express = require('express');
config = require('./config/config');
glob = require('glob');
mongoose = require('mongoose');

// Mongodb 预加载
// models = glob.sync(config.root + '/app/models/*.js');
// models.forEach(function (model) {
//   console.log('Loading Mongodb model：' + model);
//   require(model);
// });

AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

// 端口一定要从环境变量 `LEANCLOUD_APP_PORT` 中获取。
// LeanEngine 运行时会分配端口并赋值到该变量。
app = express();

// 应用程序加载
require('./config/express')(app, config);

var PORT = parseInt(process.env.LEANCLOUD_APP_PORT || 3000);
app.listen(PORT, function () {
  console.log('Node app is running, port:', PORT);

  // 注册全局未捕获异常处理器
  process.on('uncaughtException', function(err) {
    console.error("Caught exception:", err.stack);
  });
  process.on('unhandledRejection', function(reason, p) {
    console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason.stack);
  });
});

// 应用程序启动 mongoose
require('./app/helper/mongoconn');