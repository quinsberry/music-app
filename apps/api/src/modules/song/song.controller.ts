import { Controller, Get, Header, Param, Query } from '@nestjs/common';
import { Song } from '@prisma/client';
import { SongRepository } from './song.repository';
import { ResponsePagination } from '@/shared/responses/ResponsePagination';
import { COOKIE_AUTH_TOKEN_KEY } from '../auth/guards/auth.guard';
import { Cookies } from '@/shared/decorators/cookies.decorator';

@Controller('songs')
export class SongController {
    constructor(private readonly songRepository: SongRepository) {}

    @Get('/search')
    @Header('content-type', 'application/json')
    async search(
        @Cookies(COOKIE_AUTH_TOKEN_KEY) userId: string,
        @Query('substr') substr?: string,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('order') order?: 'asc' | 'desc',
        @Query('sort') sorting?: keyof Omit<Song, 'id'>
    ) {
        let songResponse;
        if (userId) {
            songResponse = await this.songRepository.findAllWithFavorites(Number(userId), {
                substr,
                skip: skip ? parseInt(skip) : undefined,
                take: take ? parseInt(take) : undefined,
                order,
                sorting,
            });
        } else {
            songResponse = await this.songRepository.findAll({
                substr,
                skip: skip ? parseInt(skip) : undefined,
                take: take ? parseInt(take) : undefined,
                order,
                sorting,
            });
        }
        return new ResponsePagination(songResponse.songs, {
            total: songResponse.total,
            page: Math.floor(songResponse.skip / songResponse.take) + 1,
            pages: Math.ceil(songResponse.total / songResponse.take),
            per_page: songResponse.take,
        });
    }
}
