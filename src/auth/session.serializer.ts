import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { PrismaService } from "src/prisma.services";

 


 @Injectable()

 export class SessionSerializer extends PassportSerializer{
    constructor (private prisma:PrismaService){
        super()
    }
    
    serializeUser(user: any, done: Function) {
        done(null,user)
    }
    async  deserializeUser(payload: any, done: Function) {
        const user = await this.prisma.user.findUnique({
            where:{
                id:payload.id
            }
        })
        done(null,user)
      }
}
    