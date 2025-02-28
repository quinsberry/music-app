import { Song } from '@repo/api/models';
import { debounce } from '@/shared/lib/debounce';
import { useState, useCallback, useRef } from 'react';
import { getSongs } from '@/entities/song';

interface Pagination {
    totalItems: number;
    pageSize: number;
}

export const useSongsTableStore = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        totalItems: 0,
        pageSize: 10,
    });

    const fetchSongs = async (val: string = '', page: number) => {
        const songs = await getSongs(val, (page - 1) * pagination.pageSize, pagination.pageSize);
        setSongs(songs.data);
        setPagination({
            totalItems: songs.meta.total,
            pageSize: songs.meta.per_page,
        });
    };

    const searchSongs = useCallback(debounce(fetchSongs, 300), []);

    return {
        songs,
        pagination,
        fetchSongs,
        searchSongs,
    };
};
