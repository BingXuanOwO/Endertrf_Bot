const onAt = ["干啥？", "怎么了？", "嗷呜？", "awa", "qwq"];

exports.exec = (msg,rawMsg,user_id,group_id,event,client) => {


    if (event.atme && msg.length == 1) {
        event.reply(onAt[Math.floor(Math.random() * onAt.length)]);
    }
}