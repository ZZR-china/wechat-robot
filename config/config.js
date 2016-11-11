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
  wechat_api:{
    token_url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential'
  },
  pos:{
    url: 'http://4s.dkys.org:10943'
  }
};

module.exports = config