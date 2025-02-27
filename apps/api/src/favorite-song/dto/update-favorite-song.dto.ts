import { PartialType } from '@nestjs/mapped-types';
import { CreateFavoriteSongDto } from './create-favorite-song.dto';

export class UpdateFavoriteSongDto extends PartialType(CreateFavoriteSongDto) {}
