// 引用 wechat 库，详细请查看 https://github.com/node-webot/wechat
const router = require('express').Router(),
    wechat = require('wechat'),
    request = require('request'),
    regqr = require('../helpers/regqr'),
    token_helper = require('../helpers/tokenDb'),
    config = require('../../config/config'),
    request_post = require('../helpers/request_post'),
    request_get = require('../helpers/request_get'),
    posUser = require('../service/user.service');

router.use('/testwc', wechat('testwc', (req, res, next) => {
    // 微信输入信息都在req.weixin上
    const message = req.weixin,
        openid = message.FromUserName,
        scence = message.EventKey,
        event = message.Event;
    const content = message.Content;
    let messageContent = "";
    regqr.getStoreid(scence)
        .then(result => {
            const scence1 = result.scence;
            switch (scence1) {
                case 'admin':
                    messageContent = "正在注册管理员";
                    res.reply({
                        content: messageContent,
                        type: 'text'
                    });
                    return posUser.adminRgister(openid, result.store_id)
                    break;
                case 'register':
                    messageContent = "正在注册。。。";
                    res.reply({
                        content: messageContent,
                        type: 'text'
                    });
                    return posUser.staffRgister(openid, result.store_id)
                    break;
                case 'login':
                    messageContent = "正在登录。。。";
                    res.reply({
                        content: messageContent,
                        type: 'text'
                    });
                    return posUser.loginCheck(openid, result.uid)
                    break;
                default:
                    console.log('this is not default scence')
                    messageContent = "欢迎来到本平台！"
                    res.reply(message_send);
                    return next();
                    break;
            }
        })
        .then(result => {
            return next();
        })
        .catch(err => {
            console.error(err)
            return next();
        })
}));

router.route('/testwc')
    .get(function(req, res, next) {
        res.send('111');
    })

router.route('/token')
    .get((req, res) => {
        token_helper.getToken(function(err, token) {
            res.send(token);
        })
    })

router.route('/')
    .get((req, res) => {
        res.send('index path in testwc.js');
    })

module.exports = function(app) {
    app.use('/', router);
};
