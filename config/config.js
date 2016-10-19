var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

var config = {
  token: 'wetest',
  appId: 'wxd62a2af068f0693a',
  appSecret: 'c40eb5ab81add3be6502f6b7f7d1d5dd',
  root: rootPath,
  cookieSecret: 'blog',
  companyUr   : "test.foowala.com",
  port        : 3000,
  maxOrderTime: 1080,
  accessKey   : 'AKIAO2EPEC6YSBZO44JQ',
  secretKey   : '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',
  wechat      : {
    hostName  : 'api.weixin.qq.com',
    appId     : 'wxd62a2af068f0693a',
    appSecret : 'c40eb5ab81add3be6502f6b7f7d1d5dd',
    token     : 'testwc'
  },
  app      : {
      name: 'foowala-test'
  },
  mongo    : {
      db: 'mongodb://magic:magic@ds053146.mlab.com:53146/foowala'
  },
  main     : {
    languagePath: rootPath + '/language/'
  },
  cookie   : {
    secret     : 'foowala',
    sessionName: 'session'
  },
  yunpian  : {
    apiKey : '20a4152a354eaea512a093e891e08639'
  },
  pay : {
    way: 0.03
  }
};

module.exports = config