const reg ={
  getStoreid:(str)=>{
    return new Promise((resolve, reject)=>{
      const uid = str;
      const newUserReg = /^qrscene_/,
            store_id   = /store_id=/g,
            ticket   = /ticket/,
            isadminReg = /\?admin/g,
            isRegisterReg = /\?register/g;
      const isNew = newUserReg.test(str),
            isStore = store_id.test(str),
            isAdmin = isadminReg.test(str),
            isRegister = isRegisterReg.test(str);
      // console.log('str', str);
      // console.log('isAdmin', isAdmin);
      // console.log('isRegister', isRegister);
      if ( !isStore && !isAdmin ) {
        resolve({uid:uid, scence:'login'})
      }else if(isStore && isAdmin ) {
        str = str.replace(newUserReg,"")
                 .split(store_id)[1]
                 .split(isadminReg);
        // console.log(str);
        resolve({store_id: str[0], scence: 'admin'})
      }else if(isStore && isRegister && !isAdmin) {
        str = str.replace(newUserReg,"")
                 .split(store_id)[1]
                 .split(isRegisterReg);
        // console.log(str);
        resolve({store_id: str[0], scence: 'register'})
      }
    });
  },
}

module.exports = exports = reg