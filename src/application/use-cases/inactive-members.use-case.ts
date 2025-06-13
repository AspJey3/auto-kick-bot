import { resolve } from "path";
import { config } from "../../config/config";
import { UserI } from "../../domain/models/user.models";
import { MemberRepository } from "../../domain/repository/member.repository";

export class InactiveMembersUseCase {

    constructor(
        private readonly memberRepo: MemberRepository,
        private readonly maxMessages = config.messageLength,
    ) { }

    async execute(): Promise<UserI[]> {
        const inactive = await this.memberRepo.getAllMembers(this.maxMessages);
        await this.memberRepo.saveJson(inactive);
        return inactive;
    }
}