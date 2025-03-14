import { Song } from '@repo/api/models';
import { useState, useCallback, useEffect } from 'react';
import { addSongToFavorites, getSongs, removeSongFromFavorites } from '@/entities/song';
import { debounce } from '@/shared/lib/debounce';
import { login } from '@/entities/user';

interface Pagination {
    totalItems: number;
    pageSize: number;
    sorting: {
        field: 'title' | 'duration' | 'year' | 'favorite';
        order: 'asc' | 'desc';
    };
}

export const useSongsTableStore = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        totalItems: 0,
        pageSize: 10,
        sorting: {
            field: 'title',
            order: 'asc',
        },
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchSongs = async (val: string = '', page: number) => {
        const songs = await getSongs(val, (page - 1) * pagination.pageSize, pagination.pageSize, pagination.sorting.field, pagination.sorting.order);
        setSongs(songs.data);
        setPagination((prev) => ({
            ...prev,
            totalItems: songs.meta.total,
            pageSize: songs.meta.per_page,
        }));
    };

    const sortSongs = async (sorting: 'title' | 'duration' | 'year' | 'favorite', order: 'asc' | 'desc') => {
        const songs = await getSongs('', 0, pagination.pageSize, sorting, order);
        setSongs(songs.data);
        setPagination((prev) => ({
            ...prev,
            totalItems: songs.meta.total,
            pageSize: songs.meta.per_page,
            sorting: {
                field: sorting,
                order,
            },
        }));
    };

    const toggleFavorite = async (checked: boolean, songId: number) => {
        if (isAuthenticated) {
            if (checked) {
                await addSongToFavorites(songId);
            } else {
                await removeSongFromFavorites(songId);
            }
            setSongs(songs.map((song) => (song.id === songId ? { ...song, isFavorite: checked } : song)));
        }
    };

    const searchSongs = debounce(fetchSongs, 300);

    const setPageSize = async (newPageSize: number) => {
        try {
            const songs = await getSongs('', 0, newPageSize, pagination.sorting.field, pagination.sorting.order);
            setSongs(songs.data);
            setPagination((prev) => ({
                ...prev,
                totalItems: songs.meta.total,
                pageSize: newPageSize,
            }));
        } catch (error) {
            console.error('Failed to fetch songs with new page size:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await login();
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
            fetchSongs('', 1);
        };
        fetchData();
    }, []);

    return {
        songs,
        pagination,
        isAuthenticated,
        fetchSongs,
        sortSongs,
        toggleFavorite,
        searchSongs,
        setPageSize,
    };
};
