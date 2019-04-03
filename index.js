// npm config set registry https://registry.npm.taobao.org
//npm config set puppeteer_download_host=https://npm.taobao.org/mirrors
const {Wechaty} = require('wechaty');
const {FileBox} = require('file-box');
const qrCodeTerm = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

//global initialize area
let login_status = false;
let logFile = fs.createWriteStream(path.resolve(`./send.log`));
//bot initialize
const bot = Wechaty.instance({profile: 'autoLogin'});
bot.on('scan', (qrcode, status) => {
    if (status === 0) {
        if (!login_status) {
            qrCodeTerm.generate(qrcode, {small: true});
            log("扫描二维码登录微信");
        }
    }
}).on('login', async user => {
    log(`用户 ${user.name()} 登录成功`);
    login_status = true;
    await main(user);
    log("处理结束");
}).on('logout', (user) => {
    log(`用户 ${user.name()} 退出`);
    exit();
}).on('error', (error) => {
    log(`发生错误, ${error}`);
    exit();
}).start();

//functions======================
async function main(user) {
    const contactFile = process.argv[2];
    for (const cName of fs.readFileSync(path.resolve(contactFile), 'UTF-8').split('\n')) {
        await bot.Contact.find({name: cName}).then(
            async (contact) => {
                if (contact !== null && contact.friend()) {
                    actionWithContact(contact);
                    log(`${cName}-成功`);
                } else {
                    log(`${cName}-没有这个账号或者不是好友`);
                }
            });
    }
}

const xlsExample = FileBox.fromFile(process.argv[3]);

async function actionWithContact(contact) {
    await contact.say(xlsExample);
    await contact.say(encodeURIComponent(`${process.argv[4]}`));
}

function log(line) {
    console.log(line);
    logFile.write(line + '\r\n');
}

function exit() {
    bot.stop().then(() => {
        process.exit();
    });
}