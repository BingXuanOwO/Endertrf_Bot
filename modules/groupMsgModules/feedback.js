const { segment } = require("oicq");
const config = JSON.parse(fs.readFileSync("config.json").toString());

exports.exec = (msg,rawMsg,user_id,group_id,event,client) => {
    console.log(msg[0]);
    console.log(msg[1]);
    if (event.atme && msg[1].text.indexOf("[反馈]") == (0 | 1) ) {
        let [...feedbackMsg] = msg;
        feedbackMsg.splice(0,1,'收到来自 ',user_id.toString(),' 的反馈:');
        client.sendGroupMsg(config.output_group,feedbackMsg);
        event.reply([segment.at(user_id),' 反馈成功.'])
    }
}