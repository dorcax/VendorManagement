import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { PrismaService } from 'src/prisma.services';
import { SessionSerializer } from './session.serializer';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';

@Module({
  // imports:[UserModule,PassportModule.register({session:true})],
  imports:[UserModule,PassportModule,JwtModule.register({
    secret:"mysecret",
    signOptions: { expiresIn: '60s' },
  })],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,PrismaService,SessionSerializer,JwtStrategy],
  exports:[AuthService] 


})
export class AuthModule {}
