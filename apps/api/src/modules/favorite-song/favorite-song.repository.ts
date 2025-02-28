import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { FavoriteSong } from '@prisma/client';

@Injectable()
export class FavoriteSongRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findOne(userId: number, songId: number) {
        return this.prisma.favoriteSong.findUnique({
            where: { userId_songId: { userId, songId } },
        });
    }

    async addToFavorites(userId: number, songId: number) {
        const existingFavorite = await this.prisma.favoriteSong.findUnique({
            where: { userId_songId: { userId, songId } },
        });
        if (existingFavorite) {
            throw new BadRequestException('Song already in favorites');
        }
        return this.prisma.favoriteSong.create({
            data: {
                userId,
                songId,
            },
        });
    }

    async removeFromFavorites(userId: number, songId: number) {
        return this.prisma.favoriteSong.delete({
            where: { userId_songId: { userId, songId } },
        });
    }

    async findAll(
        userId: number,
        options: {
            substr?: string;
            skip?: number;
            take?: number;
            order?: 'asc' | 'desc';
            sorting?: keyof Omit<FavoriteSong, 'id'>;
        }
    ) {
        const { substr = '', skip = 0, take = 10, order = 'asc', sorting = 'id' } = options;
        return this.prisma.favoriteSong.findMany({
            skip,
            take,
            where: {
                userId,
                OR: [{ song: { title: { contains: substr } } }, { song: { artist: { contains: substr } } }],
            },
            include: {
                song: true,
            },
            orderBy: {
                [sorting]: order,
            },
        });
    }
}
