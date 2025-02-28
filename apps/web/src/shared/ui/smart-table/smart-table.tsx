'use client';

import * as React from 'react';
import {
    type ColumnDef,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    type ColumnFiltersState,
    getSortedRowModel,
    type VisibilityState,
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

interface TablePaginationState {
    page: number;
    nextPage: number | null;
    prevPage: number | null;
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
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pageSize, setPageSize] = React.useState<number>(paginationProps?.pageSize ?? 10);

    const totalItems = paginationProps?.totalItems ?? data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const [pagination, setPagination] = React.useState<TablePaginationState>({
        page: 1,
        nextPage: totalPages > 1 ? 2 : null,
        prevPage: null,
    });
    React.useEffect(() => {
        if (sorting[0]) {
            onSortingsChange?.(sorting[0]);
            setPagination((prev) => ({
                ...prev,
                page: 1,
                nextPage: totalPages > 1 ? 2 : null,
                prevPage: null,
            }));
        }
    }, [sorting, onSortingsChange, totalPages]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex: pagination.page - 1,
                pageSize: pageSize,
            },
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
            columnVisibility,
            setColumnVisibility,
            pagination,
            setPagination,
            pageSize,
            setPageSize,
            totalItems,
            totalPages,
        }),
        [table, sorting, columnFilters, columnVisibility, pagination, pageSize, totalItems, totalPages]
    );

    return (
        <TableContext.Provider value={contextValue}>
            <div className="w-full">
                <TableToolbar
                    pageSizeOptions={paginationProps?.pageSizeOptions ?? [10, 20, 30, 40, 50]}
                    onPageSizeChange={onPageSizeChange}
                    onInputChange={onInputChange}
                />
                <DataTable table={table} columns={columns.length} />
                <TablePagination onPageChange={onPageChange} itemsCount={data.length} />
            </div>
        </TableContext.Provider>
    );
}
