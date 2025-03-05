import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    BadRequestException,
    UseGuards,
    Delete,
    HttpCode,
} from '@nestjs/common';
import { CreateFavoriteSongDto } from './dto/create-favorite-song.dto';
import { FavoriteSongRepository } from './favorite-song.repository';
import { FavoriteSong } from '@prisma/client';
import { AuthGuard, COOKIE_AUTH_TOKEN_KEY } from '@/modules/auth/guards/auth.guard';
import { Cookies } from '@/shared/decorators/cookies.decorator';
import { ResponsePagination } from '@/shared/responses/ResponsePagination';
import { ResponseSingle } from '@/shared/responses/ResponseSingle';

@Controller('favorites')
export class FavoriteSongController {
    constructor(private readonly favoriteSongRepository: FavoriteSongRepository) {}

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(201)
    async add(@Body() createFavoriteSongDto: CreateFavoriteSongDto, @Cookies(COOKIE_AUTH_TOKEN_KEY) userId: string) {
        const res = await this.favoriteSongRepository.addToFavorites(Number(userId), Number(createFavoriteSongDto.songId));
        return new ResponseSingle(res.song);
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAll(
        @Cookies(COOKIE_AUTH_TOKEN_KEY) userId: string,
        @Query('substr') substr?: string,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('order') order?: 'asc' | 'desc',
        @Query('sort') sorting?: keyof Omit<FavoriteSong, 'id'>
    ) {
        if (!userId) {
            throw new BadRequestException('userId parameter is required');
        }
        const songsResponse = await this.favoriteSongRepository.findAll(Number(userId), {
            substr,
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            order,
            sorting,
        });
        return new ResponsePagination(songsResponse.songs, {
            total: songsResponse.total,
            skip: songsResponse.skip,
            take: songsResponse.take,
        });
    }

    @Delete(':songId')
    @UseGuards(AuthGuard)
    @HttpCode(204)
    async remove(@Param('songId') songId: string, @Cookies(COOKIE_AUTH_TOKEN_KEY) userId: string) {
        if (!songId) {
            throw new BadRequestException('songId parameter is required');
        }
        if (!userId) {
            throw new BadRequestException('userId parameter is required');
        }
        const favoriteSong = await this.favoriteSongRepository.findOne(Number(userId), Number(songId));
        if (!favoriteSong) {
            throw new BadRequestException('Song not found in favorites');
        }
        await this.favoriteSongRepository.removeFromFavorites(Number(userId), Number(songId));
    }
}
