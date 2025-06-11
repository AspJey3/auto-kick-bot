import { Client, GatewayIntentBits } from 'discord.js';
import dotev from 'dotenv'
import { config } from './config/config';

dotev.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ]
})

client.on("ready", async () => {
    console.log(`Bot is ready! What are we gonna do?`)
});


client.on("messageCreate", async (message)=>{
    if(message.guild! || message.author?.bot) return;

    if(message.content === '!check'){
        
    }

    if(message.content === '!checkme'){
        if(message.member?.permissions.has('KickMembers')){
            message.reply("✅ Tienes el permiso `KICK_MEMBERS`.")
        }else{
            message.reply("❌ No tienes el permiso `KICK_MEMBERS`.")
        }
    }
});

client.login(config.token)