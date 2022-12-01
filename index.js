//log4js 日志的配置
const log4js = require("log4js");
log4js.configure({
  level: "DEBUG",
  appenders: {
    out: { type: "console" },
    fileLog: {
      type: "file",
      filename: "./log/log.log",
      keepFileExt: true,
      maxLogSize: 1024 * 1024 * 1,
      backups: 3,
    },
    verifyFileLog: {
      type: "file",
      filename: "./log/verify.log",
      keepFileExt: true,
      maxLogSize: 1024 * 1024 * 1,
      backups: 3,
    },
    debugFileLog: {
      type: "file",
      filename: "./log/debug.log",
      keepFileExt: true,
      maxLogSize: 1024 * 1024 * 1,
      backups: 3,
    },
  },
  categories: {
    default: { appenders: ["out", "fileLog"], level: "debug" },
    addVerify: { appenders: ["out", "verifyFileLog"], level: "debug" },
    debug: { appenders: ["out", "debugFileLog"], level: "debug" },
  },
});
const logger = log4js.getLogger();

//fs&path
const fs = require("fs");
const path=require('path');

//OICQ主模块
const { createClient, segment } = require("oicq");
const config = JSON.parse(fs.readFileSync("config.json").toString());
const client = createClient(config.account);



var groupMsgModules = [];
var privMsgModules = [];


client.on("system.online", () => {
  logger.info("Logged in");
  
  //获取所有的模块
  let groupMsgModuleFilenames = fs.readdirSync('./modules/groupMsgModules/');
  groupMsgModuleFilenames.forEach(element => {
    if(path.extname(element) == '.js'){
      groupMsgModules.push(element);
    }
  });
  let privMsgModuleFilenames = fs.readdirSync('./modules/privMsgModules/');
  privMsgModuleFilenames.forEach(element => {
    if(path.extname(element) == '.js'){
      privMsgModules.push(element);
    }
  });
});

//收到消息后处理
client.on("message.group", (event) => {
  let msg = event.message;
  let rawMsg = event.raw_message;
  let group_id = event.group_id;
  let user_id = event.sender.user_id;

  event.group.markRead()
  try{
    if(groupMsgModules.length > 0){
      console.log(groupMsgModules)
      groupMsgModules.forEach(element => {

          require('./modules/groupMsgModules/' + element).exec(msg,rawMsg,user_id,group_id,event,client);
          //require('./modules/groupMsgModules/' + element)
          console.log('modules/groupMsgModules/' + element)
      });
    }
    //执行所有获取到的模块
  }catch(error){
    logger.error(error)
  }

  /*
  //通过正则获取网页链接
  if ( /(https?:\/\/)([a-zA-z0-9-&=%?\/]+(\.)?){0,}/gi.test(rawMsg)) {
    let webUrl = /(https?:\/\/)([a-zA-z0-9-&=%?\/]+(\.)?){0,}/gi.exec(rawMsg)[0];
    logger.info("Url Detected:" + webUrl);
  }
  */

});

client.on("message.private", (event)=>{

  let msg = event.message;
  let rawMsg = event.raw_message;
  let user_id = event.sender.user_id;
  console.log(privMsgModules.length );
  //执行所有获取到的模块
  if(privMsgModules.length > 0){

    privMsgModules.forEach(element => {
      let module = require('./modules/privMsgModules/' + element);
      module.exec(msg,rawMsg,user_id,event,client);
    });
  }

})

client.on("notice.group.increase", async function (e) {
  
});

// client.on("request.group.invite", function (e) {
//   e.approve(true);
// });

// client.on("request.group.add", (e) => {
//   e.approve(true);
// });

/*
//扫码登录
client.on("system.login.qrcode", function (e) {
  //扫码后按回车登录
  process.stdin.once("data", () => {
    this.login();
  })
}).login()
*/

//密码登录
client.on("system.login.slider", function (e) {
    console.log("输入ticket：");
    process.stdin.once("data", (ticket) =>
      this.submitSlider(String(ticket).trim())
    );
}).login(config.password);