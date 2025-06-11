import { Guild } from "discord-types/general";
import { MemberRepository } from "../../domain/repository/member.repository";
import { UserI } from "../../domain/models/user.models";

export class DiscordRepository implements MemberRepository  {
    constructor(private guild:Guild){

    }

    getAllMembers(): Promise<UserI[]> {
        return Promise.resolve([]);
    }

    getMessageCount(memberId: string): Promise<number> {
        return Promise.resolve(0)
    }
}