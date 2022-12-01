const config = JSON.parse(fs.readFileSync("config.json").toString());

const sleep = (time)=>{
    return new Promise((resolve,reject)=>setTimeout(() => resolve(), time))
}

exports.exec = async (msg,rawMsg,user_id,event,client)=>{

    console.log(msg);

    if(user_id == config.trusted_installer &msg[0].text && msg[0].text.indexOf("[公告]") == 0){
        let grouplist = client.gl;
        let groups = [];
        await grouplist.forEach(element=>{
            console.log(element.group_id);
            groups.push(element.group_id);
        })
        //console.log(groups);
        console.log(groups.length);
        for (let index = 0; index < groups.length; index++) {
            let group = groups[index];
            let [ ...sendMsg ] = msg
            console.log(group)
            // //sendMsg.push('\r\n[时间戳:'+new Date()+']')
            sendMsg.push('\r\n[时间戳:'+ Date.now() +']')
            // client.sendGroupMsg(group,msg);
            client.sendGroupMsg(198771515,sendMsg);
            await sleep(1500);
        }
    }
}