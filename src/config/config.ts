import dotenv from "dotenv"

dotenv.config();

export const config = {
    token: process.env.DISCORD_TOKEN,
    appId: process.env.APP_ID,
    idChannel: process.env.ID_CHANNEL,
    messageLength: 0,
}
