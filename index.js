const tmi = require('tmi.js');
require('dotenv').config();

const client = new tmi.Client({
	options: {debug: true, messagesLogLevel: "info"},
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: `${process.env.TWITCH_USERNAME}`,
        password: `oauth:${process.env.TWITCH_OAUTH}`
    },
    requestMembershipCapability: false,
	channels: [`${process.env.TWITCH_CHANNEL}`]
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
    if(self || tags.username == process.env.TWITCH_USERNAME)return;
    checkInsultes(channel,tags,message);
	if(!message.startsWith('!')) return;
    const args = message.slice(1).split(' ');
	const commandName = args.shift().toLowerCase();
	if(commandName === 'hello') {
		client.say(channel, `@${tags.username}, yo!`);
	}
    if(commandName === "settitle"){

    }
});

client.on("connected", (address, port) => {
    client.action(
      process.env.CHANNEL_NAME,
      `Connecter sur ${address}:${port}`
    );
  });

function checkInsultes(channel, user, message){
    CantSend = false;
    CantSend = insultes.some(lainsulte => message.includes(lainsulte.toLowerCase()));
    if(CantSend === true&& user.mod != true){
        client.say(channel, `@${user.username}, merci de ne pas dire d'insultes dans tes messages.`);
        client.deletemessage(channel, user.id).then((data) => {
            return;
        }).catch((err) =>{
            console.log("Une erreur est survenue lors de la suppresion du message : " + err)
        });
    }
}