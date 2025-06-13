import { UserI } from "../models/user.models";

export interface MemberRepository{
    getAllMembers(maxMessages: number):Promise<UserI[]>,
    saveJson(member:UserI[]):Promise<void>,
}