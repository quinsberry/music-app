import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { Song } from '@prisma/client';

@Injectable()
export class SongRepository {
    private readonly logger = new Logger(SongRepository.name);

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

        const total = await this.prisma.song.count({
            where: {
                OR: [{ title: { contains: substr } }, { artist: { contains: substr } }],
            },
        });

        if (sorting === 'favorite') {
            const songs = await this.prisma.$queryRaw<(Song & { isFavorite: boolean })[]>`
            SELECT 
                s.*,
                CASE WHEN fs."user_id" IS NOT NULL THEN 1 ELSE 0 END as "isFavorite"
            FROM "songs" s
            LEFT JOIN "favorite_songs" fs ON s.id = fs."song_id" AND fs."user_id" = ${userId}
            WHERE s.title LIKE '%' || ${substr} || '%' 
                OR s.artist LIKE '%' || ${substr} || '%'
            ORDER BY 
                CASE WHEN fs."user_id" IS NOT NULL 
                    THEN ${order === 'asc' ? 0 : 1}
                    ELSE ${order === 'asc' ? 1 : 0}
                END,
                s.id ASC
            LIMIT ${take}
            OFFSET ${skip}
        `;

            return {
                songs: songs.map((song) => ({
                    ...song,
                    isFavorite: Boolean(song.isFavorite),
                })),
                total,
                skip,
                take,
            };
        }

        const songs = await this.prisma.song.findMany({
            skip,
            take,
            where: {
                OR: [{ title: { contains: substr } }, { artist: { contains: substr } }],
            },
            include: {
                favoriteSongs: {
                    where: {
                        userId,
                    },
                },
            },
            orderBy: {
                [sorting]: order,
            },
        });

        return {
            songs: songs.map((song) => ({
                ...song,
                isFavorite: song.favoriteSongs.length > 0,
                favoriteSongs: undefined,
            })),
            total,
            skip,
            take,
        };
    }
}
