const request = require('request');
const cheerio=require("cheerio");
const log4js = require('log4js');
const logger = log4js.getLogger();

const search = (question,page)=>{
    return new Promise((resolve,reject)=>{
        request(encodeURI('https://cn.bing.com/search?q=' + question),(error,response,body)=>{
            if(response.statusCode != 200){console.log(response.statusCode)}
            let $ = cheerio.load(body)
            console.log(response.url);
            let searchResults = []
            $('#b_results .b_algo').each((i, element)=>{
                let searchResult = {}

                searchResult.text = $(element).children('.b_title').text();
                searchResult.url = $(element).children('.b_caption').children('.b_attribution').text();
                searchResult.desc = $(element).children('.b_caption').children('.b_lineclamp4').text();

                searchResults[i] = searchResult;
            })
            resolve(searchResults);
        })
    })
}

exports.exec = async (msg,rawMsg,user_id,group_id,event,client) => {
    if (rawMsg.indexOf("必应搜索") == 0) {
        logger.info('Bing search detected:' + rawMsg.substring(5) + ',' + user_id)
        let msg = ['必应搜索结果:\r\n']
        let searchRes = await search(rawMsg.substring(5))
        console.log(searchRes)
        logger.info('Bing search result:' + searchRes + ',' + user_id);
        // msg.push(':共' + searchRes.length + '个结果。\r\n')
        searchRes.forEach(element => {
            msg.push(
                ' - ' + element.text,
                '(' + element.url +')\r\n'
            )
        });

        event.reply(msg);
    }
}