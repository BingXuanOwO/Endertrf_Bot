const fs = require("fs");
const { segment } = require("oicq");

const a = fs.readdirSync('./')
const helpDocument = fs.readFileSync("./helpDocument.xml").toString();

exports.exec = (msg,rawMsg,user_id,group_id,event,client)=>{
    if (rawMsg == ".help") {
        event.reply(['(帮助文档重置中)']);
        //event.reply([segment.xml(helpDocument)]);
    }
}