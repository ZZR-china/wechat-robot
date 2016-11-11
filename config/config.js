var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

var config = {
  root: rootPath,
  cookieSecret: 'blog',
  companyUr   : "http://wechatme.leanapp.cn",
  port        : 3000,
  maxOrderTime: 1080,
  app      : {
      name: 'foowala-test'
  },
  localmongo:{
      db: 'mongodb://127.0.0.1:27017/foowala'
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