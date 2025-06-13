import {
    Guild,
    TextChannel,
    Message,
    ChannelType,
    FetchMessagesOptions,
    Snowflake,
    Collection,
} from "discord.js";
import { MemberRepository } from "../../domain/repository/member.repository";
import { UserI } from "../../domain/models/user.models";
import { promises as fs } from 'fs'
import path from "path";
import { CHANNELS_IDS } from "../../utils/channels";

export class DiscordRepository implements MemberRepository {
    constructor(private guild: Guild) { }

    async getAllMembers(maxMessages: number): Promise<UserI[]> {
        console.log("🔍 Iniciando getAllMembers...");

        // 1. Traer miembros
        const members = await this.guild.members.fetch();
        console.log(`👥 Miembros encontrados: ${members.size}`);

        const users: UserI[] = [];

        // 2. Contar mensajes por miembro (optimizado)
        const counts: Record<string, number> = {};
        const textChannels = this.guild.channels.cache.filter(
            (c): c is TextChannel =>
                c.type === ChannelType.GuildText &&
                c.viewable &&
                !CHANNELS_IDS.includes(c.id)
        );

        console.log(`📨 Canales de texto detectados: ${textChannels.size}`);

        for (const [channelId, channel] of textChannels) {
            console.log(`📥 Procesando canal: ${channel.name} (${channelId})`);

            let lastId: Snowflake | undefined;
            let fetched = 0;

            const fetchOptionsBase: FetchMessagesOptions = { limit: 100 };

            do {
                const options: FetchMessagesOptions = lastId
                    ? { ...fetchOptionsBase, before: lastId }
                    : fetchOptionsBase;

                const batch: Collection<Snowflake, Message> = await channel.messages.fetch(options);
                console.log(`📄 Mensajes obtenidos en lote: ${batch.size}`);
                if (batch.size === 0) break;

                for (const msg of batch.values()) {
                    if (!msg.author || msg.author?.bot) continue;

                    counts[msg.author?.id] = (counts[msg.author?.id] || 0) + 1;
                }

                lastId = batch.last()?.id;
                fetched += batch.size;
            } while (fetched < 10000);
        }

        console.log("🧮 Conteo de mensajes por usuario:");
        for (const [id, count] of Object.entries(counts)) {
            console.log(`   - ${id}: ${count} mensajes`);
        }

        // 3. Filtrar y armar UserI con messageCount
        members
            .filter(m => !m.user.bot)
            .forEach(m => {
                const cnt = counts[m.id] || 0;
                console.log(`🔎 Usuario: ${m.user.username}, Mensajes: ${cnt}`);

                if (cnt <= maxMessages) {
                    users.push({
                        id: m.id,
                        username: m.user.username,
                        joinedAt: m.joinedAt ?? new Date(),
                        messageCount: cnt,
                    });
                    console.log(`⚠️ Agregado como inactivo: ${m.user.username}`);
                }
            });

        console.log(`✅ Total de usuarios inactivos encontrados: ${users.length}`);
        return users;
    }

    private isAutoMessage(content: string): boolean {
        const patterns = [
            /subiste al nivel/i,
            /bienvenido/i,
            /felicidades/i,
            /ascendido/i,
            /has sido/i,
        ]
        return patterns.some(pattern => pattern.test(content))
    }

    async saveJson(members: UserI[]): Promise<void> {
        const timestamp = new Date().toISOString()
            .replace(/:/g, '-')  // Para sistemas que no permiten ":" en nombres de archivos
            .replace(/\..+/, '') // Quitar milisegundos y zona horaria

        const dirPath = './data/backups'
        const fileName = `usersInactive-${timestamp}.json`
        const filePath = path.join(dirPath, fileName)

        await fs.mkdir(dirPath, { recursive: true })
        await fs.writeFile(filePath, JSON.stringify(members, null, 2), 'utf-8')
    }
}