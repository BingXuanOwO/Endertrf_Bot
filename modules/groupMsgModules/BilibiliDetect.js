var request = require('request');
const log4js = require('log4js');
const logger = log4js.getLogger();
const { segment } = require("oicq");

const GetVideoInfo = (videoNum,type)=>{
    return new Promise((resolve,reject)=>{
        let arg = "";
        if(type==0){
            arg = "?aid=" + videoNum;
        }
        if(type==1){
            arg = "?bvid=" + videoNum;
        } 
        request('http://api.bilibili.com/x/web-interface/view' + arg, function (error, response, body) {
            if (!error) {
                //序列化json，如果api报错就向日志内输出错误，并直接取消继续读取
                var obj = JSON.parse(body);
                if(obj.code != 0) {
                    resolve({
                        code:obj.code,
                        msg:obj.message
                    })
                    return;
                }
                resolve({
                    code:obj.code,
                    msg:obj.message,

                    title : obj.data.title,
                    desc : obj.data.desc,
                    picUrl : obj.data.pic,
                    

                    avid : 'av' + obj.data.aid,
                    bvid : obj.data.bvid,

                    up : obj.data.owner.name,
                    upUid : obj.data.owner.mid,
                    
                })
            }
            else{
                reject(error);
            }
        })
    });
}

const SendVideoInfo = async (event,videoNum,type) => {
    let info = await GetVideoInfo(videoNum,type)
    //序列化json，如果api报错就向日志内输出错误，并直接取消继续读取

    if(info.code!=0){
        event.reply(['BiliBili视频信息获取失败:',info.msg])
        return;
    }

    //获取图片URL和标题，并拼接为一条消息
    let message = [
        "BiliBili视频信息获取：\r\n",
        "标题：" + info.title + '\r\n',
        "作者：" + info.up + '\r\n',
        "AV号：" + info.avid + '\r\n',
        "BV号：" + info.bvid + '\r\n',
        "简介：" + info.desc + '\r\n',
        segment.image(info.picUrl),
        'https://www.bilibili.com/video/' + info.bvid,
    ]

    //发送消息
    event.reply(message);
}

exports.exec = (msg,rawMsg,user_id,group_id,event,client)=>{
    //通过正则获取av号
    if (/((?<=AV)([0-9]+))/gi.test(rawMsg)) {
        let num = /((?<=AV)([0-9]+))/gi.exec(rawMsg)[0];
        logger.info("Detected BiliBili Video! " + num);
        SendVideoInfo(event, num, 0);
        return;
    }

    //通过正则获取bv号
    if (/BV([1-9]|[a-z]|[A-Z])+/gi.test(rawMsg)) {
        let num = /BV([1-9]|[a-z]|[A-Z])+/gi.exec(rawMsg)[0];
        logger.info("Detected BiliBili Video! " + num);
        SendVideoInfo(event, num, 1);
        return;
    }

    //通过正则获取b23.tv开头的短链
    if (/(b23.tv\/)([A-Z]|[a-z]|[0-9])+/gi.test(msg)) {
        let url = /(b23.tv\/)([A-Z]|[a-z]|[0-9])+/gi.exec(rawMsg)[0];
        request("http://" + url, function (error, response, body) {
            if (response.request && /BV([1-9]|[a-z]|[A-Z])+/gi.test(response.request)
            ) {
                let num = /BV([1-9]|[a-z]|[A-Z])+/gi.exec(responsevent.request.uri.href)[0];
                logger.info("Detected BiliBili Video!  " + num);
                SendVideoInfo(event, num, 1);
                return;
            } else {
                logger.error("Error：Unknown Video");
                client.sendGroupMsg(e.group_id, [
                    "BiliBili视频解析错误：",
                    "此b23.tv链接并非视频链接",
                ]);
            }
        })
    } 

        
    if (rawMsg == "[json消息]" && JSON.parse(msg[0].data).desc == "哔哩哔哩") {
        request(
        JSON.parse(msg[0].data).meta.detail_1.qqdocurl,
        (error, response, body) => {
            if (!response.request) {
                logger.error("Bilibili Card Info Error:" + response);
                return;
            }
            let num = /BV([1-9]|[a-z]|[A-Z])+/gi.exec(response.request.uri.href)[0];
            logger.info("Detected BiliBili Video!  " + num);
            SendVideoInfo(event, num, 1);
        }
        );
    }


}
