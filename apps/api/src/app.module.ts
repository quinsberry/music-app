import { Module } from '@nestjs/common';
import { SongModule } from '@/modules/song/song.module';
import { UserModule } from '@/modules/user/user.module';
import { FavoriteSongModule } from '@/modules/favorite-song/favorite-song.module';
import { PrismaModule } from '@/shared/prisma/prisma.module';

@Module({
    imports: [PrismaModule, SongModule, UserModule, FavoriteSongModule, ],
})
export class AppModule {}
