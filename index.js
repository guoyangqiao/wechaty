const {Wechaty} = require('wechaty');
const {FileBox} = require('file-box');
const qrCodeTerm = require('qrcode-terminal');
const fs = require('fs');
const readline = require('readline');

let login_status = false;
//global initialize area
const bot = Wechaty.instance({profile: 'autoLogin'});
bot.on('scan', (qrcode, status) => {
    if (status === 0 && !login_status) {
        qrCodeTerm.generate(qrcode, {small: true});
        console.log(status, '扫描二维码登录微信');
    }
    if (status === 200) {
        login_status = true;
    }
});
bot.on('login', user => {
    console.log(`用户 ${user} 登录成功!`);
    main(user);
});
bot.on('logout', (user) => {
    console.log(`用户 ${user} 退出`);
    process.exit();
});
bot.on('error', (error) => {
    console.error(`发生错误, ${error}`);
    bot.stop().then(() => {
        process.exit();
    });
});
bot.start();

//functions======================
function main(user) {
    const contactFile = process.argv[2];
    const lineReader = readline.createInterface({
        input: fs.createReadStream(contactFile),
        crlfDelay: Infinity
    });
    lineReader.on('line', function (cName) {
        bot.Contact.find({name: cName}).then(
            async (contact) => {
                console.log(`${cName}-`);
                if (contact !== null && contact.friend()) {
                    await actionWithContact(contact);
                    console.log(`成功`);
                } else {
                    console.log(`没有这个账号或者不是你的好友`);
                }
            });
    });
}

const xlsExample = FileBox.fromFile(process.argv[3]);

async function actionWithContact(contact) {
    await contact.say(xlsExample);
    await contact.say(`${contact.name()}, 测试消息`);
}