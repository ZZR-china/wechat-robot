const regqr = require('../helpers/regqr'),
      request_http = require('request');

const user = {
  addUser:(open_id)=>{
    regqr.getStoreid(str)
         .then((store_id, admin)=>{
            const data = {
              open_id: open_id,
              store_id: store_id,
              job_number: "",
              password: "",
              is_admin: admin
            }
            request_http.post({url:url, form: form}, (err, httpResponse, body) => {
                        console.log(body);
                        console.log('tikect', body.ticket);
                        let tikect = tikecturl + body.ticket;
                        console.log('tikect', tikect);
                        resolve(tikect);
                    })
         })
         .catch(err =>{
            console.error(err);
         })
  }
}

module.exports = exports = user;