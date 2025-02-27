import { Module } from '@nestjs/common';
import { SongModule } from './song/song.module';
import { UserModule } from './user/user.module';
import { FavoriteSongModule } from './favorite-song/favorite-song.module';

@Module({
    imports: [SongModule, UserModule, FavoriteSongModule],
})
export class AppModule {}
