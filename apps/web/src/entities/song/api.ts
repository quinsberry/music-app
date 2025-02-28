import { ApiClient } from '@/shared/api-client';
import { ResponsePagination, Song } from '@repo/api/models';

export const getSongs = (
    val?: string,
    skip?: number,
    take?: number,
    sort?: keyof Song | 'favorite',
    order?: 'asc' | 'desc'
) => {
    return ApiClient.get<ResponsePagination<Song>>(`/songs/search`, {
        params: {
            ...(val ? { substr: val } : undefined),
            ...(skip !== undefined ? { skip: skip.toString() } : undefined),
            ...(take !== undefined ? { take: take.toString() } : undefined),
            ...(sort !== undefined ? { sort } : undefined),
            ...(order !== undefined ? { order } : undefined),
        },
    });
};

export const getFavoriteSongs = (
    val: string = '',
    skip?: number,
    take?: number,
    sort?: keyof Song,
    order?: 'asc' | 'desc'
) => {
    return ApiClient.get<ResponsePagination<Song>>(`/favorites`, {
        params: {
            ...(val ? { substr: val } : undefined),
            ...(skip !== undefined ? { skip: skip.toString() } : undefined),
            ...(take !== undefined ? { take: take.toString() } : undefined),
            ...(sort !== undefined ? { sort } : undefined),
            ...(order !== undefined ? { order } : undefined),
        },
    });
};

export const addSongToFavorites = (songId: number) => {
    return ApiClient.post<ResponsePagination<Song>>(`/favorites`, {
        body: {
            songId,
        },
    });
};

export const removeSongFromFavorites = (songId: number) => {
    return ApiClient.delete<ResponsePagination<Song>>(`/favorites/${songId}`);
};
