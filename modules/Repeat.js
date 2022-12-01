const util = require("util");
const log4js = require("log4js");
const logger = log4js.getLogger();

var lastMessages = [];


exports.exec = (msg,rawMsg,user_id,group_id,event,client)=>{
  //如果在数组里找不到群组的上一条消息，就暂存上一条消息
  //if(event.group_id != 198771515){return;}
  if (!lastMessages[event.group_id]) {
    lastMessages[event.group_id] = {
      group_id: event.group_id,
      msg: msg,
      times: 1,
      repeated: false,
    };

    return;
  }
  //如果找到上一条消息，且下一条和上一条一致，发送次数+1
  if (util.isDeepStrictEqual(lastMessages[event.group_id].msg, msg)) {
    let times = lastMessages[event.group_id].times;
    let repeated = lastMessages[event.group_id].repeated;
    times += 1;

    //如果复读次数发了超过3次，并且没复读过，直接复读
    if (times >= 3 && lastMessages[event.group_id].repeated == false) {
      event.reply(msg);
      client.sendGroupMsg(198771515,['已复读:',rawMsg]);
      repeated = true;
      logger.info("repeated:" + JSON.stringify(msg) );
    }

    lastMessages[event.group_id] = {
      group_id: event.group_id,
      msg: msg,
      times: times,
      repeated: repeated,
    };

    return;
  }
  //如果找到，但下一条和上一条不一致，更新数组
  lastMessages[event.group_id] = {
    group_id: event.group_id,
    msg: msg,
    times: 1,
    repeated: false,
  };
};