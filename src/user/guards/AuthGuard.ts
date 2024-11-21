import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private  jwtService:JwtService,
               
    ){}
    async canActivate(context: ExecutionContext):  Promise<boolean> {
      try {
        const request =context.switchToHttp().getRequest()
        const token =this.ExtractFromHeader(request)

        if(token){
            throw new UnauthorizedException("invalid credential")
        }

        const payload = await this.jwtService.verifyAsync(token)
        request.user =payload
      } catch (error) {
        throw new UnauthorizedException("invalid credentials")
      }

        return true
        
    }

    private ExtractFromHeader(request:Request){
        const authHeader =request.headers.authorization
        if(authHeader && authHeader.startsWith("Bearer")){
            return authHeader.split(" ")[1]
        }
        return undefined;
    }

}