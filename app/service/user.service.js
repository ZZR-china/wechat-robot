const regqr = require('../helpers/regqr'),
    request_http = require('request'),
    config = require('../../config/config'),
    request_get = require('../helpers/request_get'),
    request_post = require('../helpers/request_post');

const user = {
    addUser: (open_id, str) => {
        return new Promise((resolve, reject) => {
            const openidUrl = config.pos.url + '/staff/' + open_id;
            const accesstokenUrl = config.pos.url + '/accesstoken';
            let arr, staff_register_info = {};
            Promise.all([
                    regqr.getStoreid(str),
                    request_get.requestGet(openidUrl)
                ])
                .then(results => {
                    arr = results[0];
                    const staff_info = JSON.parse(results[1]);
                    console.log('staff_info', staff_info)
                    if (staff_info.status === 1) {
                        let user = {};
                        user.open_id = open_id;
                        user.status = 2;
                        user.uid = arr[1];
                        return resolve(user);
                    }
                    staff_register_info = {
                        open_id: open_id,
                        store_id: arr[0],
                        job_number: "0",
                        password: "123456",
                        is_admin: arr[2]
                    }
                    return request_get.requestGet(accesstokenUrl)
                })
                .then(result => {
                    //get user wechat info
                    const userUrl = config.wechat_api.user_url + result + '&openid=' + open_id + '&lang=zh_CN';
                    return request_get.requestGet(userUrl)
                })
                .then(result => {
                    //register user with wx info
                    const registerUrl = config.pos.url + '/register';
                    staff_register_info.wx_info = result;
                    return request_post.requestPost(registerUrl, staff_register_info)
                })
                .then(result => {
                    result = JSON.parse(result);
                    result.uid = arr[1];
                    return resolve(result);
                })
                .catch(err => {
                    console.error(err);
                })
        })
    },
    adminRgister: (open_id, store_id) => {
        return new Promise((resolve, reject) => {
            const adminUrl = config.pos.url + '/register';
            let admin_register_info = {};
            admin_register_info.is_admin = true;
            admin_register_info.open_id = open_id;
            admin_register_info.store_id = store_id;
            admin_register_info.job_number = "001";
            admin_register_info.password = "123";
            request_post.requestPost(adminUrl, admin_register_info)
                .then(result => {
                    return resolve(result);
                })
                .catch(err => {
                    console.error(err);
                })
        })
    },
    loginCheck: (open_id, uid) => {
        return new Promise((resolve, reject) => {
            const openidUrl = config.pos.url + '/staff/' + open_id;
            const accesstokenUrl = config.pos.url + '/accesstoken';
            let arr, staff_register_info = {};
            request_get.requestGet(openidUrl)
                .then(result => {
                    result = JSON.parse(result);
                    const postUrl = config.pos.url + '/uid';
                    if (result.status === 1) {
                        result.isLogin = true;
                        result.uid = uid;
                        result.open_id = open_id;
                        return request_post.requestPost(postUrl, result);
                    }else{
                        let uid_doc = {};
                        uid_doc.uid = uid;
                        uid_doc.open_id = open_id;
                        uid_doc.isLogin = false;
                        return request_post.requestPost(postUrl, uid_doc);
                    }
                })
                .then(result => {
                    resolve(JSON.parse(result));
                })
                .catch(err => {
                    console.error(err);
                })
        })
    }
}

module.exports = exports = user;
