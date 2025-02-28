import { Module } from '@nestjs/common';
import { FavoriteSongController } from './favorite-song.controller';
import { FavoriteSongRepository } from './favorite-song.repository';

@Module({
    controllers: [FavoriteSongController],
    providers: [FavoriteSongRepository],
})
export class FavoriteSongModule {}
