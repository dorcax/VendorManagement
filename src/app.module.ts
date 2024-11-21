import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.services';



@Module({
  imports: [UserModule,
    ConfigModule.forRoot({
      isGlobal:true
    }),
    AuthModule

  ]
  ,
  controllers: [AppController],
  providers: [AppService],
  // exports:[JwtModule]
})
export class AppModule {}
