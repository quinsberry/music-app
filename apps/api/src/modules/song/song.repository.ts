import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { Prisma, Song } from '@prisma/client';

@Injectable()
export class SongRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findOne(id: number) {
        return this.prisma.song.findUnique({
            where: { id },
        });
    }

    async findAll(options: {
        substr?: string;
        skip?: number;
        take?: number;
        order?: 'asc' | 'desc';
        sorting?: keyof Omit<Song, 'id'>;
    }) {
        const { substr = '', skip = 0, take = 10, order = 'asc', sorting = 'id' } = options;
        const total = await this.prisma.song.count({
            where: {
                OR: [{ title: { contains: substr } }, { artist: { contains: substr } }],
            },
        });
        const songs = await this.prisma.song.findMany({
            skip,
            take,
            where: {
                OR: [{ title: { contains: substr } }, { artist: { contains: substr } }],
            },
            orderBy: {
                [sorting]: order,
            },
        });
        return {
            songs,
            total,
            skip,
            take,
        };
    }

    async findAllWithFavorites(
        userId: number,
        options: {
            substr?: string;
            skip?: number;
            take?: number;
            order?: 'asc' | 'desc';
            sorting?: keyof Omit<Song, 'id'> | 'favorite';
        }
    ) {
        const { substr = '', skip = 0, take = 10, order = 'asc', sorting = 'id' } = options;

        let orderBy: Prisma.SongOrderByWithRelationInput = { [sorting]: order };

        if (sorting === 'favorite') {
            orderBy = {
                favoriteSongs: {
                    _count: order,
                },
            };
        } else {
            orderBy = {
                [sorting]: order,
            };
        }

        const total = await this.prisma.song.count({
            where: {
                OR: [{ title: { contains: substr } }, { artist: { contains: substr } }],
            },
        });
        const songs = (await this.prisma.song.findMany({
            skip,
            take,
            where: {
                OR: [{ title: { contains: substr } }, { artist: { contains: substr } }],
            },
            include: {
                favoriteSongs: true,
            },
            orderBy,
        }))
        .map((song) => {
            const newSong = {
                ...song,
                isFavorite: song.favoriteSongs.some((favorite) => favorite.userId === userId),
            };
            delete newSong.favoriteSongs;
            return newSong;
        });

        return {
            songs,
            total,
            skip,
            take,
        };
    }
}
