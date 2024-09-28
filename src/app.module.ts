import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [UserModule,

    ConfigModule.forRoot({
      isGlobal:true
    }),
    JwtModule.register({
      global:true,
      signOptions:{expiresIn:"1d"}
    }),
    
   


  ]
  ,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
