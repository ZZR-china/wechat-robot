const regqr = require('../helpers/regqr'),
    request_http = require('request'),
    config = require('../../config/config');

const user = {
    addUser: (open_id, str) => {
        return new Promise((resolve, reject) => {
            regqr.getStoreid(str)
                .then(arr => {
                    const staff_data = {
                        open_id: open_id,
                        store_id: arr[0],
                        job_number: "0",
                        password: "123",
                        is_admin: arr[1]
                    }
                    const url = config.pos.url + '/register';
                    console.log('url', url);
                    console.log('data', staff_data);
                    request_http.post({url:url, form: staff_data}, (err,httpResponse,body)=>{
                        console.log(body);
                        resolve(body)
                    })
                })
                .catch(err => {
                    console.error(err);
                })
        })
    }
}

module.exports = exports = user;
