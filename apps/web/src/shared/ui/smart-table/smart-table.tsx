'use client';

import * as React from 'react';
import {
    type ColumnDef,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    type ColumnFiltersState,
    getSortedRowModel,
    type SortingState,
    type RowData,
} from '@tanstack/react-table';
import { TableToolbar } from './table-toolbar';
import { DataTable } from './data-table';
import { TablePagination } from './table-pagination';
import { TableContext } from './table-context';

export type Column<TData extends RowData, TValue = unknown> = ColumnDef<TData, TValue>;

interface SmartTableProps<TData, TValue> {
    columns: Column<TData, TValue>[];
    data: TData[];
    onInputChange?: (value: string) => void;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pagination: {
        totalItems: number;
        pageSize: number;
        pageSizeOptions?: number[];
    };
    onSortingsChange?: (sorting: SortingState[number]) => void;
}

export function SmartTable<TData, TValue>({
    columns,
    data,
    pagination: paginationProps,
    onInputChange,
    onPageChange,
    onPageSizeChange,
    onSortingsChange,
}: SmartTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const totalItems = paginationProps?.totalItems ?? data.length;
    const totalPages = Math.ceil(totalItems / (paginationProps?.pageSize ?? 10));

    React.useEffect(() => {
        if (sorting[0]) {
            onSortingsChange?.(sorting[0]);
        }
    }, [sorting, onSortingsChange]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        manualPagination: true,
        pageCount: totalPages,
    });

    const contextValue = React.useMemo(
        () => ({
            table,
            sorting,
            setSorting,
            columnFilters,
            setColumnFilters,
            totalItems,
            totalPages,
        }),
        [table, sorting, columnFilters, totalItems, totalPages]
    );

    return (
        <TableContext.Provider value={contextValue}>
            <div className="w-full">
                <TableToolbar
                    pageSizeOptions={paginationProps?.pageSizeOptions ?? [10, 20, 30, 40, 50]}
                    defaultPageSize={paginationProps?.pageSize ?? 10}
                    onPageSizeChange={onPageSizeChange}
                    onInputChange={onInputChange}
                />
                <DataTable table={table} columns={columns.length} />
                <TablePagination onPageChange={onPageChange} itemsCount={data.length} />
            </div>
        </TableContext.Provider>
    );
}
