var router = require('express').Router();
// 引用 wechat 库，详细请查看 https://github.com/node-webot/wechat
var wechat = require('wechat');


router.route('/testwc')
    .get(function(req, res, next) {
        res.send('111');
    })

router.use('/testwc', wechat('testwc', (req, res, next) => {
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    var openid = message.FromUserName,
        scence = Number(message.EventKey);
    // res.reply(openid);
    console.log(openid);
    console.log(scence);
    res.reply({
        content: '用户的openid为' + openid + '场景是' + scence,
        type: 'text'
    });
}));


module.exports = function(app) {
    app.use('/', router);
};
