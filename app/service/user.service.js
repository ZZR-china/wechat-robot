const regqr = require('../helpers/regqr'),
    request_http = require('request'),
    config = require('../../config/config');

const user = {
    addUser: (open_id, str) => {
        return new Promise((resolve, reject) => {
            regqr.getStoreid(str)
                .then((store_id, admin) => {
                    const data = {
                        open_id: open_id,
                        store_id: store_id,
                        job_number: "",
                        password: "",
                        is_admin: admin
                    }
                    const url = config.pos.url + '/register';
                    request_http.post({ url: url, form: data }, (err, httpResponse, body) => {
                        resolve(body);
                    })
                })
                .catch(err => {
                    console.error(err);
                })
        })
    }
}

module.exports = exports = user;
