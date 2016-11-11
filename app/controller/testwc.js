// 引用 wechat 库，详细请查看 https://github.com/node-webot/wechat
const router = require('express').Router(),
      wechat = require('wechat'),
      request = require('request');

router.use('/testwc', wechat('testwc', (req, res, next) => {
    // 微信输入信息都在req.weixin上
    const message = req.weixin,
          openid  = message.FromUserName,
          scence  = message.EventKey,
          event   = message.Event;
    switch (event) {
        case "subscribe":
            res.reply({
                content: '欢迎关注！用户的openid为' + openid + '场景是' + scence,
                type: 'text'
            });
            break;
        case "SCAN":
            res.reply({
                content: '用户的openid为' + openid + '场景是' + scence,
                type: 'text'
            });
            break;
        default:
            res.reply({
                content: '用户的openid为' + openid + '场景是' + scence,
                type: 'text'
            });
            break;
    };
}));

router.route('/testwc')
    .get(function(req, res, next) {
        res.send('testwc');
    })

router.route('/access_token')
      .get((req, res)=> {

      })
module.exports = function(app) {
    app.use('/', router);
};
