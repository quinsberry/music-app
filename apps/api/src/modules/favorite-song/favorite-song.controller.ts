import { Controller, Get, Post, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { CreateFavoriteSongDto } from './dto/create-favorite-song.dto';
import { FavoriteSongRepository } from './favorite-song.repository';
import { FavoriteSong } from '@prisma/client';

@Controller('favorites')
export class FavoriteSongController {
    constructor(private readonly favoriteSongRepository: FavoriteSongRepository) {}

    @Post()
    add(@Body() createFavoriteSongDto: CreateFavoriteSongDto) {
        return this.favoriteSongRepository.addToFavorites(createFavoriteSongDto.userId, createFavoriteSongDto.songId);
    }

    @Get()
    findAll(
        @Query('userId') userId?: string,
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

    @Get(':songId')
    findOne(@Param('songId') songId: string, @Query('userId') userId: string) {
        if (!songId) {
            throw new BadRequestException('songId parameter is required');
        }
        if (!userId) {
            throw new BadRequestException('userId parameter is required');
        }
        return this.favoriteSongRepository.findOne(Number(userId), Number(songId));
    }

    @Get(':songId')
    remove(@Param('songId') songId: string, @Query('userId') userId: string) {
        if (!songId) {
            throw new BadRequestException('songId parameter is required');
        }
        if (!userId) {
            throw new BadRequestException('userId parameter is required');
        }
        return this.favoriteSongRepository.removeFromFavorites(Number(userId), Number(songId));
    }
}
