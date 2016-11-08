var router = require('express').Router();
// 引用 wechat 库，详细请查看 https://github.com/node-webot/wechat
var wechat = require('wechat');


router.route('/testwc')
    .get(function(req, res, next) {
        res.send('111');
    })

router.use('/testwc', wechat('testwc', (req, res, next) => {
    // 微信输入信息都在req.weixin上
    var scence = [123,222];
    var message = req.weixin;
    var openid = message.FromUserName,
        scence_id = Number(message.EventKey);
        // res.reply(openid);
    console.log(openid);
    console.log(scence_id);
    var keyIndex = scence.indexOf(scence_id);
    console.log('keyIndex',keyIndex);
    switch(keyIndex){
      case 0:
      {
        res.reply({
            content: '用户的openid为'+openid+'场景是'+scence_id,
            type: 'text'
        });
      }
      break;
      default:
      {
        res.reply({
          content: '没有这个场景!'+scence_id,
          type: 'text'
        });
      }
      break;
    }

}));


module.exports = function(app) {
    app.use('/', router);
};
