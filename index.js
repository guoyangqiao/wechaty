const {Wechaty} = require('wechaty');
const {FileBox} = require('file-box');
const qrTerm = require('qrcode-terminal');

//global initialize area
const bot = new Wechaty();
bot.on('scan', (qrcode, status) => {
    qrTerm.generate(qrcode, {small: true});
    const qrcodeImageUrl = [
        'https://api.qrserver.com/v1/create-qr-code/?data=',
        encodeURIComponent(qrcode),
    ].join('');
    console.log(`[${status}] ${qrcodeImageUrl}\n扫描上面的二维码来登录你的微信`);
});
bot.on('login', user => {
    console.log(`用户 ${user} 登录成功!`);
    core(user);
});
bot.on('logout', (user) => {
    console.log(`用户 ${user} 退出`);
});
bot.on('error', (error) => {
    console.error(error)
});
bot.start();

//functions======================
function core(user) {
    var docFile = process.argv[2];
    var contactFile = process.argv[3];
    let contact = bot.Contact.load("wiThy3Justc");
    console.log(contact);
    // const xlsExample = FileBox.fromFile('/Users/guoyangqiao/Desktop/JVMS.xls');
    // bot.Contact.find({name: "CLOTGTRYC"}).then(
    //     (contact) => {
    //         contact.say(xlsExample);
    //     });
}

