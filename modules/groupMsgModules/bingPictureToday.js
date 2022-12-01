var request = require('request');
const log4js = require('log4js');
const logger = log4js.getLogger();
const { segment } = require("oicq");

const send = function(event) {
    request('https://bing.com/HPImageArchive.aspx?format=js&idx=0&n=1', function (error, response, body) {
        if (!error) {
            //序列化json，已获取图片URL和标题
            var obj = JSON.parse(body);

            //获取图片URL和标题，并拼接为一条消息
            let message = [
                obj.images[0].title,
                segment.image("https://www.bing.com" + obj.images[0].url),
                obj.images[0].copyright,
            ]

            //发送消息
            event.reply(message).catch((e)=>console.log(e));
        }
        else{
            logger.error('Bing Image Request Error!' + error)
        }
    })
}

exports.exec = (msg,rawMsg,user_id,group_id,event,client)=>{
    if(rawMsg == "必应每日一图"){
        send(event);
    }
}