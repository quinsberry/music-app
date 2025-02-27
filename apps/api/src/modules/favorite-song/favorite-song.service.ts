import { Injectable } from '@nestjs/common';
import { CreateFavoriteSongDto } from './dto/create-favorite-song.dto';
import { UpdateFavoriteSongDto } from './dto/update-favorite-song.dto';

@Injectable()
export class FavoriteSongService {
    create(createFavoriteSongDto: CreateFavoriteSongDto) {
        return 'This action adds a new favoriteSong';
    }

    findAll() {
        return `This action returns all favoriteSong`;
    }

    findOne(id: number) {
        return `This action returns a #${id} favoriteSong`;
    }

    update(id: number, updateFavoriteSongDto: UpdateFavoriteSongDto) {
        return `This action updates a #${id} favoriteSong`;
    }

    remove(id: number) {
        return `This action removes a #${id} favoriteSong`;
    }
}
