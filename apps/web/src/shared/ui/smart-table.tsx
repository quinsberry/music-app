'use client';

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    getSortedRowModel,
    VisibilityState,
    SortingState,
    RowData,
} from '@tanstack/react-table';
import { Input } from './input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

export type Column<TData extends RowData, TValue = unknown> = ColumnDef<TData, TValue>;

interface SmartTableProps<TData, TValue> {
    columns: Column<TData, TValue>[];
    data: TData[];
    onInputChange?: (value: string) => void;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pagination?: {
        totalItems: number;
        pageSize: number;
        pageSizeOptions?: number[];
    };
    onSortingsChange?: (sortings: SortingState[number]) => void;
}

interface Pagination {
    page: number;
    pageSize: number;
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
    const [search, setSearch] = React.useState('');
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const pageSize = paginationProps?.pageSize ?? 10;
    const totalItems = paginationProps?.totalItems ?? data.length;
    const pageSizeOptions = paginationProps?.pageSizeOptions ?? [10, 20, 30, 40, 50];
    const totalPages = Math.ceil(totalItems / pageSize);
    const defaultPagination: Pagination = {
        page: 1,
        pageSize: pageSize,
        nextPage: totalPages > 1 ? 2 : null,
        prevPage: totalPages > 1 ? 1 : null,
    };
    const [pagination, setPagination] = React.useState<Pagination>(defaultPagination);

    React.useEffect(() => {
        if (sorting[0]) {
            onSortingsChange?.(sorting[0]);
            setPagination(defaultPagination);
        }
    }, [sorting]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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
                pageSize: paginationProps?.pageSize ?? 10,
            },
        },
        manualPagination: true,
        pageCount: Math.ceil((paginationProps?.totalItems ?? 0) / (paginationProps?.pageSize ?? 10)),
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange?.(event.target.value);
        setSearch(event.target.value);
    };

    const handleNextPage = () => {
        if (pagination.nextPage === null) {
            return;
        }
        handlePageChange(pagination.nextPage);
    };

    const handlePreviousPage = () => {
        if (pagination.prevPage === null) {
            return;
        }
        handlePageChange(pagination.prevPage);
    };

    const handlePageChange = (page: number) => {
        onPageChange?.(page);
        setPagination({
            ...pagination,
            page,
            nextPage: page + 1 > totalPages ? null : page + 1,
            prevPage: page - 1 < 1 ? null : page - 1,
        });
    };

    const pages = new Array(totalPages).fill(0).map((_, index) => index + 1);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input placeholder="Search..." value={search} onChange={handleInputChange} className="max-w-sm" />
                <Select
                    value={String(paginationProps?.pageSize ?? 10)}
                    onValueChange={(value) => {
                        const newSize = Number(value);
                        onPageSizeChange?.(newSize);
                        setPagination((prev) => ({
                            ...prev,
                            page: 1,
                            nextPage: 2,
                            prevPage: null,
                        }));
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select page size" />
                    </SelectTrigger>
                    <SelectContent>
                        {pageSizeOptions.map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                {size} items per page
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="rounded-sm border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {data.length}/{totalItems}
                </div>
                <div className="space-x-2">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" onClick={handlePreviousPage} />
                            </PaginationItem>
                            {pages.map((page) => {
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === pagination.page}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                            <PaginationItem>
                                <PaginationNext href="#" onClick={handleNextPage} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}
