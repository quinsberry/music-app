'use client';

import { Column, SmartTable } from '@/shared/ui/smart-table';
import { Song } from '@repo/api/models';
import { Button } from '@/shared/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/shared/ui/checkbox';
import { useSongsTableStore } from './useSongsTableStore';

export const SongsTable = () => {
    const { songs, pagination, isAuthenticated, fetchSongs, sortSongs, toggleFavorite, searchSongs } =
        useSongsTableStore();

    const columns: Column<Song>[] = [
        ...(isAuthenticated
            ? ([
                  {
                      accessorKey: 'favorite',
                      header: ({ column }) => {
                          return (
                              <Button
                                  variant="ghost"
                                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                              >
                                  Favorite
                                  <ArrowUpDown />
                              </Button>
                          );
                      },
                      cell: ({ row }) => {
                          return (
                              <Checkbox
                                  checked={row.original.isFavorite}
                                  onCheckedChange={(value) => {
                                      const songId = row.original.id;
                                      toggleFavorite(!!value, songId);
                                  }}
                              />
                          );
                      },
                  },
              ] as Column<Song>[])
            : ([] as Column<Song>[])),
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
                } else if (sorting.id === 'favorite') {
                    sortSongs('favorite', sorting.desc ? 'desc' : 'asc');
                }
            }}
            pagination={{
                totalItems: pagination.totalItems,
                pageSize: pagination.pageSize,
            }}
        />
    );
};
