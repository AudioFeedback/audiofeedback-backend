import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import { AppModule } from "./app.module";
import { mkdirSync, existsSync } from "fs";
import { ValidationPipe } from "@nestjs/common";
import express from "express";

declare const module: any;

async function bootstrap() {
  const folderPath = "./audio"; // Replace with your desired folder path

  if (!existsSync(folderPath)) {
    mkdirSync(folderPath);
  }

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Audiofeedback")
    .setDescription("The audiofeedback API description")
    .setVersion("0.1")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // await app.listen(3000);

  await app.init();

  http.createServer(server).listen(3000);

  if (process.env.PRIVATE_KEY_PATH && process.env.CERTIFICATE_PATH) {
    const httpsOptions = {
      key: fs.readFileSync(process.env.PRIVATE_KEY_PATH),
      cert: fs.readFileSync(process.env.CERTIFICATE_PATH),
    };

    https.createServer(httpsOptions, server).listen(3001);
  }

  // Dit stukje code zorgt ervoor dat "hot reloading" werkt in development
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
