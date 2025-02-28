import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule);
        app.use(cookieParser());
        app.enableCors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        });
        await app.listen(process.env.PORT ?? 4000);
    } catch (error) {
        console.error(error);
    }
}
bootstrap();
