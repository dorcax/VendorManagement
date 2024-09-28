import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private  jwtService:JwtService,
                 private  configService:ConfigService
    ){}
    async canActivate(context: ExecutionContext):  Promise<boolean> {
      try {
        const request =context.switchToHttp().getRequest()
        const token =this.ExtractFromHeader(request)

        if(token){
            throw new UnauthorizedException("invalid credential")
        }

        const payload = await this.jwtService.verifyAsync(token,{
            secret:this.configService.get<string>("JWT_SECRET")
        })
        request.user =payload
      } catch (error) {
        throw new UnauthorizedException("invalid credentials")
      }

        return true
        
    }

    private ExtractFromHeader(request){
        const authHeader =request.headers.authorization()
        if(authHeader &authHeader.startWith("Bearer")){
            return authHeader.split(" ")[1]
        }
        return undefined;
    }

}