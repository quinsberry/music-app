import { Controller, Get, Param, Query } from '@nestjs/common';
import { Song } from '@prisma/client';
import { SongRepository } from './song.repository';

@Controller('songs')
export class SongController {
    constructor(private readonly songRepository: SongRepository) {}

    @Get('/search/:userId')
    async searchWithFavorites(
        @Param('userId') userId: number,
        @Query('substr') substr?: string,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('order') order?: 'asc' | 'desc',
        @Query('sorting') sorting?: keyof Omit<Song, 'id'> | 'favorite'
    ) {
        return this.songRepository.findAllWithFavorites(userId, {
            substr,
            skip: skip ? parseInt(skip) : undefined,
            take: take ? parseInt(take) : undefined,
            order,
            sorting,
        });
    }

    @Get('/search')
    search(
        @Query('substr') substr?: string,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('order') order?: 'asc' | 'desc',
        @Query('sorting') sorting?: keyof Omit<Song, 'id'>
    ) {
        return this.songRepository.findAll({
            substr,
            skip: skip ? parseInt(skip) : undefined,
            take: take ? parseInt(take) : undefined,
            order,
            sorting,
        });
    }
}
