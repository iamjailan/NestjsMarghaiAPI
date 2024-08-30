import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT;
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 86400000 }, //one day
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(PORT);
}
bootstrap();
