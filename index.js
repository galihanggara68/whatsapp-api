const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const fs = require("fs");
const SESSION_FILE_PATH = "./session.json";

const express = require("express");
const app = express();

app.use(express.json());

app.post("/sendMessage", async (req, res, next) => {
	const {message, number} = req.body;
	const contact = await client.getContactById(number);
	let chat = await contact.getChat();
	await chat.sendMessage(message);
	res.send({message, number});
});

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

client.on('ready', async () => {
    app.listen(8080, () => {
		console.log("Server up");
	});
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