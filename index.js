const Wechaty = require('wechaty');
const FileBox = require('file-box');
const qrCodeTerm = require('qrcode-terminal');
const fs = require('fs');
const readline = require('readline');

//global initialize area
const bot = Wechaty.instance({profile: 'autoLogin'});
bot.on('scan', (qrcode, status) => {
    if (status === 0) {
        qrCodeTerm.generate(qrcode, {small: true});
        console.log(status, '扫描二维码登录微信');
    }
});
bot.on('login', user => {
    console.log(`用户 ${user} 登录成功!`);
    core(user);
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
function core(user) {
    const docFile = process.argv[2];
    const contactFile = process.argv[3];
    const xlsExample = FileBox.fromFile(docFile);
    const lineReader = readline.createInterface({
        input: fs.createReadStream(contactFile),
        crlfDelay: Infinity
    });
    lineReader.on('line', function (cName) {
        bot.Contact.find({name: cName}).then(
            (contact) => {
                contact.say(xlsExample);
            });
    });
    console.log("执行结束");
}