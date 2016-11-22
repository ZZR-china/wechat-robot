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
    const keyArray = ['管理员', '你好'];
    const content = message.Content;
    const keyIndex = keyArray.indexOf(content);
    // if (keyIndex === 0) {
    //     //admin register
    //     const adminUrl = config.pos.url + '/adminqr?name:nana&storename:kendeji';
    //     request_get.requestGet(adminUrl, open_id)
    //         .then(result => {
    //             res.reply({
    //                 type: "text",
    //                 content: '您好!您已经在foowala pos上成功创建一个门店！'
    //             });
    //         })
    // }
    // let content;
    console.log('scence', scence);
    regqr.getStoreid(scence)
        .then(result => {
            console.log('result', result);
            if (result.isLogin) {
                return posUser.loginCheck(openid, result.uid)
            }else {
                return posUser.adminRgister(openid, result.store_id)
            }
        })
        .then(result => {
            console.log("result2", result)
            res.reply({
                 content: '正在登录!',
                 type: 'text'
             })
        })
        .catch(err => {
            console.error(err)
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
        token_helper.getToken(function(err, token) {
            res.send('index path in testwc.js');
        })
    })

module.exports = function(app) {
    app.use('/', router);
};
