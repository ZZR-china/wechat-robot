const reg ={
  getStoreid:(str)=>{
    return new Promise((resolve, reject)=>{
      const uid = str;
      const newUserReg = /^qrscene_/,
            store_id   = /store_id=/g,
            ticket   = /ticket/,
            isadminReg = /\?admin/g;
      const isNew = newUserReg.test(str),
            isStore = store_id.test(str),
            isAdmin = isadminReg.test(str);
      console.log('str', str);
      console.log('isAdmin', isAdmin);
      console.log('str', str);
      let isLogin;
      if ( !isStore && !isAdmin ) {
        isLogin = true;
        resolve({uid:uid, isLogin:isLogin, isAdmin: false})
      }else if(isStore && isAdmin ){
        str = str.replace(newUserReg,"")
                 .split(store_id)[1]
                 .split(isadminReg);
        isLogin = false;
        console.log(str);
        // resolve([str[0], str[1], isAdmin, isLogin]);
        resolve({store_id: str[0], isAdmin: isAdmin, isLogin:isLogin})
      }
    });
  },
}

module.exports = exports = reg