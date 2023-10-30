import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { mkdirSync, existsSync } from "fs";

declare const module: any;

async function bootstrap() {
  const folderPath = "./audio"; // Replace with your desired folder path

  if (!existsSync(folderPath)) {
    mkdirSync(folderPath);
  }

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Audiofeedback")
    .setDescription("The audiofeedback API description")
    .setVersion("0.1")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);

  // Dit stukje code zorgt ervoor dat "hot reloading" werkt in development
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
