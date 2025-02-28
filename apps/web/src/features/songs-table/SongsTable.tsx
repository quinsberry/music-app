'use client';

import { Column, SmartTable } from '@/shared/ui/smart-table';
import { useCallback, useEffect, useState } from 'react';
import { Song } from '@repo/api/models';
import { Button } from '@/shared/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { getSongs } from '@/entities/song';
import { debounce } from '@/shared/lib/debounce';

interface Pagination {
    totalItems: number;
    pageSize: number;
}

export const SongsTable = () => {
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

    const sortSongs = async (sorting: 'title' | 'duration' | 'year', order: 'asc' | 'desc') => {
        const songs = await getSongs('', 0, pagination.pageSize, sorting, order);
        setSongs(songs.data);
        setPagination({
            totalItems: songs.meta.total,
            pageSize: songs.meta.per_page,
        });
    };

    const searchSongs = useCallback(debounce(fetchSongs, 300), []);

    useEffect(() => {
        fetchSongs('', 1);
    }, []);

    const columns: Column<Song>[] = [
        {
            accessorKey: 'title',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Title
                        <ArrowUpDown />
                    </Button>
                );
            },
        },
        {
            accessorKey: 'artist',
            header: 'Artist',
        },
        {
            accessorKey: 'duration',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Duration
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const duration = row.getValue('duration') as number;
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                return (
                    <span className="text-center">
                        {minutes}:{seconds.toString().padStart(2, '0')}
                    </span>
                );
            },
        },
        {
            accessorKey: 'genre',
            header: 'Genre',
        },
        {
            accessorKey: 'year',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Year
                        <ArrowUpDown />
                    </Button>
                );
            },
        },
    ];

    return (
        <SmartTable
            columns={columns}
            data={songs}
            onInputChange={(value) => searchSongs(value, 1)}
            onPageChange={(page) => fetchSongs('', page)}
            onSortingsChange={(sorting) => {
                if (sorting.id === 'title') {
                    sortSongs('title', sorting.desc ? 'desc' : 'asc');
                } else if (sorting.id === 'duration') {
                    sortSongs('duration', sorting.desc ? 'desc' : 'asc');
                } else if (sorting.id === 'year') {
                    sortSongs('year', sorting.desc ? 'desc' : 'asc');
                }
            }}
            pagination={{
                totalItems: pagination.totalItems,
                pageSize: pagination.pageSize,
            }}
        />
    );
};
