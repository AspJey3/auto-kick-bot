import { UserI } from "../models/user.models";

export interface MemberRepository{
    getAllMembers():Promise<UserI[]>
    getMessageCount(memberId:string):Promise<number>
}