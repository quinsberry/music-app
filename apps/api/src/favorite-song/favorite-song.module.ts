import { Module } from '@nestjs/common';
import { FavoriteSongService } from './favorite-song.service';
import { FavoriteSongController } from './favorite-song.controller';

@Module({
    controllers: [FavoriteSongController],
    providers: [FavoriteSongService],
})
export class FavoriteSongModule {}
