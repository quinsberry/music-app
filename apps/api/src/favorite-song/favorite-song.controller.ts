import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavoriteSongService } from './favorite-song.service';
import { CreateFavoriteSongDto } from './dto/create-favorite-song.dto';
import { UpdateFavoriteSongDto } from './dto/update-favorite-song.dto';

@Controller('favorite-song')
export class FavoriteSongController {
    constructor(private readonly favoriteSongService: FavoriteSongService) {}

    @Post()
    create(@Body() createFavoriteSongDto: CreateFavoriteSongDto) {
        return this.favoriteSongService.create(createFavoriteSongDto);
    }

    @Get()
    findAll() {
        return this.favoriteSongService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.favoriteSongService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFavoriteSongDto: UpdateFavoriteSongDto) {
        return this.favoriteSongService.update(+id, updateFavoriteSongDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.favoriteSongService.remove(+id);
    }
}
