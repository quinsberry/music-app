import * as React from 'react';
import type { ColumnFiltersState, SortingState, VisibilityState, Table } from '@tanstack/react-table';

interface TablePaginationState {
    page: number;
    nextPage: number | null;
    prevPage: number | null;
}

interface TableContextType {
    table: Table<any>;
    sorting: SortingState;
    setSorting: (sorting: SortingState) => void;
    columnFilters: ColumnFiltersState;
    setColumnFilters: (filters: ColumnFiltersState) => void;
    columnVisibility: VisibilityState;
    setColumnVisibility: (visibility: VisibilityState) => void;
    pagination: TablePaginationState;
    setPagination: (pagination: TablePaginationState) => void;
    pageSize: number;
    setPageSize: (size: number) => void;
    totalItems: number;
    totalPages: number;
}

export const TableContext = React.createContext<TableContextType | undefined>(undefined);

export function useTableContext() {
    const context = React.useContext(TableContext);
    if (!context) {
        throw new Error('useTableContext must be used within a TableProvider');
    }
    return context;
}
