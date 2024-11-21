import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from "express-session"
import * as passport from "passport"
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
//  setting up session
  app.use(
    session({
      secret: 'my-secret', //get the secret from env variable
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize())
  app.use(passport.session())
 
  await app.listen(3000);
}
bootstrap();
