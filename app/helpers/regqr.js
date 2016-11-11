const reg ={
  getStoreid:(str)=>{
    return new Promise((resolve, reject)=>{
      const newUserReg = /^qrscene_/,
            isadminReg = /\?admin$/;
      const isNew = newUserReg.test(str),
            isAdmin = isadminReg.test(str);
      console.log('str', str);
      console.log('isAdmin', isAdmin);
      const store_id = str.replace(newUserReg,"").replace(isadminReg,"");
      resolve([store_id, isAdmin]);
    });
  },
}

module.exports = exports = reg