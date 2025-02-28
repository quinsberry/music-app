import { Module } from '@nestjs/common';
import { SongModule } from '@/modules/song/song.module';
import { UserModule } from '@/modules/user/user.module';
import { FavoriteSongModule } from '@/modules/favorite-song/favorite-song.module';
import { PrismaModule } from '@/shared/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        PrismaModule,
        AuthModule,
        SongModule,
        UserModule,
        FavoriteSongModule,
    ],
})
export class AppModule {}
