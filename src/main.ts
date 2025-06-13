import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import dotev from 'dotenv'
import { config } from './config/config';
import { saveMembersCommandAdapter } from './adapters/save-members-command.adapter';

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


client.on("messageCreate", async (message) => {
    if (!message.guild || message.author?.bot) return;

    if (message.content === "!hello") {
        message.reply("ESTOY ACTIVO PUTO IMBECIL ✅")
    }

    if (message.content === '!check') {
        const guild = message.guild;
        const fullGuild = await guild.fetch();
        const replyChannel = message.channel as TextChannel;
        if (!guild && !replyChannel) return;

        await saveMembersCommandAdapter(fullGuild, replyChannel )
    }

    if (message.content === '!checkme') {
        if (message.member?.permissions.has('KickMembers')) {
            message.reply("✅ Tienes el permiso `KICK_MEMBERS`.")
        } else {
            message.reply("❌ No tienes el permiso `KICK_MEMBERS`.")
        }
    }
});

client.login(config.token)