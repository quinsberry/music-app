import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    BadRequestException,
    UseGuards,
    Req,
    Delete,
    HttpCode,
} from '@nestjs/common';
import { CreateFavoriteSongDto } from './dto/create-favorite-song.dto';
import { FavoriteSongRepository } from './favorite-song.repository';
import { FavoriteSong } from '@prisma/client';
import { AuthGuard, COOKIE_AUTH_TOKEN_KEY } from '@/modules/auth/guards/auth.guard';
import { Cookies } from '@/shared/decorators/cookies.decorator';

@Controller('favorites')
export class FavoriteSongController {
    constructor(private readonly favoriteSongRepository: FavoriteSongRepository) {}

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(201)
    async add(@Body() createFavoriteSongDto: CreateFavoriteSongDto, @Cookies(COOKIE_AUTH_TOKEN_KEY) userId: string) {
        await this.favoriteSongRepository.addToFavorites(Number(userId), Number(createFavoriteSongDto.songId));
        return {
            message: 'Song added to favorites',
        };
    }

    @Get()
    @UseGuards(AuthGuard)
    findAll(
        @Cookies(COOKIE_AUTH_TOKEN_KEY) userId: string,
        @Query('substr') substr?: string,
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('order') order?: 'asc' | 'desc',
        @Query('sorting') sorting?: keyof Omit<FavoriteSong, 'id'>
    ) {
        if (!userId) {
            throw new BadRequestException('userId parameter is required');
        }
        return this.favoriteSongRepository.findAll(Number(userId), {
            substr,
            skip: skip ? Number(skip) : undefined,
            take: take ? Number(take) : undefined,
            order,
            sorting,
        });
    }

    @Delete(':songId')
    @UseGuards(AuthGuard)
    remove(@Param('songId') songId: string, @Cookies(COOKIE_AUTH_TOKEN_KEY) userId: string) {
        if (!songId) {
            throw new BadRequestException('songId parameter is required');
        }
        if (!userId) {
            throw new BadRequestException('userId parameter is required');
        }
        return this.favoriteSongRepository.removeFromFavorites(Number(userId), Number(songId));
    }
}
