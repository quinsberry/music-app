import { ApiClient } from '@/shared/api-client';
import { Song } from '@repo/api/models';

interface ResponseList<T> {
    data: T[];
    meta: {
        page: number;
        pages: number;
        per_page: number;
        total: number;
    };
}

export const getSongs = (val?: string, skip?: number, take?: number, sort?: keyof Song, order?: 'asc' | 'desc') => {
    return ApiClient.get<ResponseList<Song>>(`/songs/search`, {
        params: {
            ...(val ? { substr: val } : undefined),
            ...(skip !== undefined ? { skip: skip.toString() } : undefined),
            ...(take !== undefined ? { take: take.toString() } : undefined),
            ...(sort !== undefined ? { sort } : undefined),
            ...(order !== undefined ? { order } : undefined),
        },
    });
};

export const getFavoriteSongs = (val: string = '', skip?: number, take?: number) => {
    return ApiClient.get<ResponseList<Song>>(`/favorite-songs/search`, {
        params: {
            ...(val ? { substr: val } : undefined),
            ...(skip !== undefined ? { skip: skip.toString() } : undefined),
            ...(take !== undefined ? { take: take.toString() } : undefined),
        },
    });
};
