import { Guild, TextChannel } from "discord.js";
import { DiscordRepository } from "../infrastructure/discord/discord-member.repository";
import { InactiveMembersUseCase } from "../application/use-cases/inactive-members.use-case";

export async function saveMembersCommandAdapter(guild: Guild, replyChannel: TextChannel) {

    await replyChannel.send("🔍 Buscando usuarios con ≤ 0 mensajes...");
    const repo = new DiscordRepository(guild)
    const useCase = new InactiveMembersUseCase(repo)
    console.log("paso aquí")
    const inactive = await useCase.execute()

    await replyChannel.send(
        `✅ Backup creado: ${inactive.length} usuarios inactivos.`
    );

}