'use client';

import { SmartTable } from '@/shared/ui/smart-table';
import { useSongsTableStore } from './useSongsTableStore';
import { useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Song } from '@repo/api/models';
import { Button } from '@/shared/ui/button';
import { ArrowUpDown } from 'lucide-react';

const columns: ColumnDef<Song>[] = [
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

export const SongsTable = () => {
    const { songs, fetchSongs, searchSongs, pagination } = useSongsTableStore();

    useEffect(() => {
        fetchSongs('', 1);
    }, []);

    return (
        <SmartTable
            columns={columns}
            data={songs}
            onInputChange={(value) => searchSongs(value, 1)}
            onPageChange={(page) => fetchSongs('', page)}
            pagination={{
                totalItems: pagination.totalItems,
                pageSize: pagination.pageSize,
            }}
        />
    );
};
