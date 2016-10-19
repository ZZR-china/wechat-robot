var messageModel = function() {
  return {
    data   : [],
    status : 0,
    msg    : '错误操作！',
    success: function(msg, data) {
      this.status = 1;
      this.msg    = msg;
      this.data   = data;
      return this;
    },
    unsuccess: function(msg) {
      this.msg = msg;
      return this;
    }
  };
};

module.exports = messageModel;
