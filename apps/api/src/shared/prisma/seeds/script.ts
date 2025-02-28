import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '@/app.module';
import { songs, users } from './data';

async function main() {
    NestFactory.createApplicationContext(AppModule).then(async (appContext) => {
        const prisma = new PrismaClient();

        async function seedSongs(): Promise<void> {
            await prisma.song.createMany({
                data: songs,
            });
            return;
        }

        async function seedUsers(): Promise<void> {
            await prisma.user.createMany({
                data: users,
            });
            return;
        }

        return seedSongs()
            .then(() => console.log('Songs are seeded'))
            .then(() => seedUsers())
            .then(() => console.log('Users are seeded'))
            .then(() => {
                console.debug('Seeding complete!');
            })
            .catch(async (error) => {
                console.error('Seeding failed!');
                console.error(error);
                await prisma.$disconnect();
                process.exit(1);
            })
            .finally(async () => {
                appContext.close();
                await prisma.$disconnect();
            });
    });
}

main();
