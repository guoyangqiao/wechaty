const {Wechaty} = require('wechaty');
const {FileBox} = require('file-box');
const qrCodeTerm = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const moment = require('moment');

let login_status = false;
//global initialize area
let logFile = fs.createWriteStream(path.resolve(`./${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}.log`));
const bot = Wechaty.instance({profile: 'autoLogin'});
bot.on('scan', (qrcode, status) => {
    if (status === 0) {
        if (!login_status) {
            qrCodeTerm.generate(qrcode, {small: true});
            console.log("扫描二维码登录微信");
        }
    }
});
bot.on('login', user => {
    console.log(`用户 ${user.name()} 登录成功!\n`);
    login_status = true;
    main(user);
});


bot.on('logout', (user) => {
    console.log(`用户 ${user.name()} 退出`);
    exit();
});
bot.on('error', (error) => {
    console.error(`发生错误, ${error}`);
    exit();
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
                if (contact !== null && contact.friend()) {
                    await actionWithContact(contact);
                    log(`${cName}-成功`);
                } else {
                    log(`${cName}-没有这个账号或者不是好友`);
                }
            });
    });
}

const xlsExample = FileBox.fromFile(process.argv[3]);

async function actionWithContact(contact) {
    await contact.say(xlsExample);
    await contact.say(`${contact.name()}, 测试消息`);
}

function log(line) {
    console.log(line);
    logFile.write(line + '\n');
}

function exit() {
    bot.stop().then(() => {
        process.exit();
    });
}
