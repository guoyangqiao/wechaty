const {Wechaty} = require('wechaty');
const {FileBox} = require('file-box');
const qrTerm = require('qrcode-terminal');

//global initialize area
const bot = Wechaty.instance({profile: 'autoLogin'});
bot.on('scan', (qrcode, status) => {
    if (status === 0) {
        qrTerm.generate(qrcode, {small: true});
        console.log('扫描二维码登录微信');
    } else {
        //不做任何操作
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
bot.on('发生错误', (error) => {
    console.error(error)
});
bot.start();

//functions======================
function core(user) {
    var docFile = process.argv[2];
    var contactFile = process.argv[3];
    // const xlsExample = FileBox.fromFile('/Users/guoyangqiao/Desktop/JVMS.xls');
    // bot.Contact.find({name: "CLOTGTRYC"}).then(
    //     (contact) => {
    //         contact.say(xlsExample);
    //     });
    console.log("执行结束");
}

