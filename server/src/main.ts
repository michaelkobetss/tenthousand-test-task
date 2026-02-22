import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: "http://localhost:5173",
        credentials: true,
    });
    await app.listen(4000);
    console.log("🚀 Server running on http://localhost:4000/graphql");
}

bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});