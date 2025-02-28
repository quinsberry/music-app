import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongRepository } from './song.repository';

@Module({
    controllers: [SongController],
    providers: [SongRepository],
})
export class SongModule {}
