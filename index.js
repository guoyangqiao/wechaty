const {Wechaty} = require('wechaty');
const {FileBox} = require('file-box');
const qrCodeTerm = require('qrcode-terminal');
const fs = require('fs');
const readline = require('readline');

let login_status = false;
const docFile = process.argv[2];
const contactFile = process.argv[3];
const xlsExample = FileBox.fromFile(docFile);
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
    process.exit();
});
bot.start();

//functions======================
function main(user) {
    const lineReader = readline.createInterface({
        input: fs.createReadStream(contactFile),
        crlfDelay: Infinity
    });
    lineReader.on('line', function (cName) {
        bot.Contact.find({name: cName}).then(
            (contact) => {
                console.log(`对联系人${cName}进行操作`);
                if (contact !== null && contact.friend()) {
                    actionWithContact(contact);
                } else {
                    console.log(`${cName}->没有这个人或者不是你的好友`);
                }
            });
    });
    console.log("执行结束");
}

function actionWithContact(contact) {
    contact.say(xlsExample);
}