import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Module({
  imports: [UserModule,
    ConfigModule.forRoot({
      isGlobal:true
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('EXPIRY') },
      }),
      inject: [ConfigService],
    })

  ]
  ,
  controllers: [AppController],
  providers: [AppService],
  exports:[JwtModule]
})
export class AppModule {}
