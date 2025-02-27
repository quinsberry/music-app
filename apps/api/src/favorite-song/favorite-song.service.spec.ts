import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteSongService } from './favorite-song.service';

describe('FavoriteSongService', () => {
    let service: FavoriteSongService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FavoriteSongService],
        }).compile();

        service = module.get<FavoriteSongService>(FavoriteSongService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
