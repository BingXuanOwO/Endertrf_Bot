var request = require('request');
const log4js = require('log4js');
const logger = log4js.getLogger();
const { segment } = require("oicq");



const GetRandomImage = ()=>{
    return new Promise((resolve,reject)=>{
        request('https://cloud.foxtail.cn/api/function/random?name=&type=', function (error, response, body) {
            if (error) {logger.error('ShouYunJi API Request Error:' + error);return(-1);}
            if (response.statusCode != 200) {logger.error('ShouYunJi API Request Error:' + response.statusCode);return(-1)}

            let obj = JSON.parse(body)

            console.log('https://cloud.foxtail.cn/api/function/pictures?picture=' + obj.picture.picture);

            //获取图片URL
            request('https://cloud.foxtail.cn/api/function/pictures?picture=' + obj.picture.picture, function (error, response, imageBody) {
                if(error){logger.error('ShouYunJi API Request Error:' + error);return(-1);}
                resolve({name:obj.picture.name,id:obj.picture.id,url:JSON.parse(imageBody).url})
            })

            
        })
    })
}

const SendRandomImage = async(event) => {
    let image = await GetRandomImage().catch(e=>logger.error(e));
    if(image == -1){return;}
    event.reply([
        "=======兽云祭API=======",
        segment.image(image.url),
        "兽名：" + image.name + "\r\n",
        "ID：" + image.id + "\r\n",
        "==================="
    ]);
}


exports.exec = (msg,rawMsg,user_id,group_id,event,client)=>{
    if(rawMsg == "随机兽图"){
        SendRandomImage(event);
    }
}