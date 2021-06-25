const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const fs = require("fs");
const SESSION_FILE_PATH = "./session.json";

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
	session: sessionData
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('authenticated', (session) => {    
    fs.writeFile("session.json", JSON.stringify(session), (err) => {
		console.log("Session Written");
	});
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();