const regqr = require('../helpers/regqr'),
    request_http = require('request'),
    config = require('../../config/config'),
    request_get = require('../helpers/request_get'),
    request_post = require('../helpers/request_post');

const user = {
    adminRgister: (open_id, store_id) => {
        return new Promise((resolve, reject) => {
            const adminUrl = config.pos.url + '/register';
            let admin_register_info = {};
            admin_register_info.is_admin = true;
            admin_register_info.open_id = open_id;
            admin_register_info.store_id = store_id;
            admin_register_info.password = "123";
            request_post.requestPost(adminUrl, admin_register_info)
                .then(result => {
                    const json_result = JSON.parse(result),
                          status = json_result.status;
                    let   staff_data = json_result.data ? json_result.data:{};
                    console.log('staff_data', staff_data);
                    staff_data.scence = "register";
                    if (status === 1) {
                        staff_data.isRegister = 1;
                    } else {
                        staff_data.isRegister = 2;
                    }
                    var connection = global.connection;
                    connection.send(JSON.stringify(staff_data));
                    resolve(staff_data);
                })
                .catch(err => {
                    console.error(err);
                })
        })
    },
    staffRgister: (open_id, store_id) => {
        return new Promise((resolve, reject) => {
            const staffUrl = config.pos.url + '/register';
            let staff_register_info = {};
            staff_register_info.is_admin = false;
            staff_register_info.open_id = open_id;
            staff_register_info.store_id = store_id;
            staff_register_info.password = "123";
            request_post.requestPost(staffUrl, staff_register_info)
                .then(result => {
                    const json_result = JSON.parse(result),
                          status = json_result.status;
                    let   staff_data = json_result.data ? json_result.data:{};
                    console.log('staff_data', staff_data);
                    staff_data.scence = "register";
                    if (status === 1) {
                        staff_data.isRegister = 1;
                    } else {
                        staff_data.isRegister = 2;
                    }
                    var connection = global.connection;
                    connection.send(JSON.stringify(staff_data));
                    resolve(staff_data);
                })
                .catch(err => {
                    console.error(err);
                    var connection = global.connection;
                    connection.send(JSON.stringify({isRegister: 0}));
                })
        })
    },
    loginCheck: (open_id, uid) => {
        return new Promise((resolve, reject) => {
            const openidUrl = config.pos.url + '/staff/login?open_id=' + open_id + '&uid='+uid;
            request_get.requestGet(openidUrl)
                .then(result => {
                    const json_result = JSON.parse(result),
                          status = json_result.status;
                    let   staff_data = json_result.data ? json_result.data : {};
                    console.log('staff_data', staff_data);
                    staff_data.uid = uid;
                    staff_data.scence = "login";
                    if (status === 1) {
                        staff_data.isLogin = 1;
                        staff_data.isStaff = true;
                    } else {
                        staff_data.open_id = open_id;
                        staff_data.isLogin = 2;
                        staff_data.nickname = "不是员工";
                        staff_data.isStaff = false;
                    }
                    var connection = global.connection;
                    connection.send(JSON.stringify(staff_data));
                    resolve(staff_data);
                })
                .catch(err => {
                    console.error(err);
                    var connection = global.connection;
                    connection.send(JSON.stringify({isLogin:0}));
                })
        })
    }

}

module.exports = exports = user;
