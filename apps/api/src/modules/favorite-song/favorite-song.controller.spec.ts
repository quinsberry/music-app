import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteSongController } from './favorite-song.controller';
import { FavoriteSongService } from './favorite-song.service';

describe('FavoriteSongController', () => {
    let controller: FavoriteSongController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FavoriteSongController],
            providers: [FavoriteSongService],
        }).compile();

        controller = module.get<FavoriteSongController>(FavoriteSongController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
