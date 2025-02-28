import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Input } from '@/shared/ui/input';
import { TableBody, TableCell } from '@/shared/ui/table';
import { Table, TableHead, TableRow } from '@/shared/ui/table';
import { TableHeader } from '@/shared/ui/table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './pagination';

interface Column<T> {
    key: keyof T;
    header: string;
    type?: 'text' | 'number' | 'date';
}

const rowHeight = 40;

interface SmartTableProps<T> {
    data: T[];
    columns: Column<T>[];
    pageSize?: number;
    onPageChange?: (page: number) => void;
    onInputChange?: (value: string) => void;
}

export const SmartTable = <T extends Record<string, any>>({
    data,
    columns,
    pageSize = 10,
    onPageChange,
    onInputChange,
}: SmartTableProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(pageSize);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T | null;
        direction: 'asc' | 'desc' | null;
    }>({ key: null, direction: null });

    // Sorting function
    const sortData = (data: T[], key: keyof T, direction: 'asc' | 'desc') => {
        return [...data].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];

            const column = columns.find((col) => col.key === key);

            // Create comparison result variable
            let result: number;

            switch (column?.type) {
                case 'number':
                    result = Number(aValue) - Number(bValue);
                    break;
                case 'date':
                    result = new Date(aValue).getTime() - new Date(bValue).getTime();
                    break;
                default:
                    // Natural sort for text that might contain numbers
                    const collator = new Intl.Collator(undefined, {
                        numeric: true,
                        sensitivity: 'base',
                    });
                    result = collator.compare(String(aValue), String(bValue));
            }

            // Apply sort direction
            return direction === 'desc' ? -result : result;
        });
    };

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let processed = [...data];

        // Apply search filter
        if (searchTerm) {
            processed = processed.filter((item) =>
                Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
            );
        }

        // Apply sorting
        if (sortConfig.key && sortConfig.direction) {
            processed = sortData(processed, sortConfig.key, sortConfig.direction);
        }

        return processed;
    }, [data, searchTerm, sortConfig]);

    // Pagination
    const totalPages = new Array(Math.ceil(filteredAndSortedData.length / itemsPerPage))
        .fill(0)
        .map((_, index) => index + 1);
    const paginatedData = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (key: keyof T) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange?.(e.target.value);
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        const newPage = Math.max(1, Math.min(page, totalPages.length));
        onPageChange?.(newPage);
        setCurrentPage(newPage);
    };

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages.length; i++) {
            if (i === 1 || i === totalPages.length || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input placeholder="Search..." value={searchTerm} onChange={handleOnInputChange} className="max-w-sm" />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={String(column.key)}
                                    className="cursor-pointer"
                                    onClick={() => handleSort(column.key)}>
                                    <div className="flex items-center">
                                        {column.header}
                                        {sortConfig.key === column.key &&
                                            (sortConfig.direction === 'asc' ? (
                                                <ChevronUp className="ml-1 h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="ml-1 h-4 w-4" />
                                            ))}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody style={{ height: `${rowHeight * pageSize}px` }}>
                        {paginatedData.length > 0 ? (
                            <>
                                {paginatedData.map((row, index) => (
                                    <TableRow key={index} style={{ maxHeight: `${rowHeight}px` }}>
                                        {columns.map((column) => (
                                            <TableCell className="py-2" key={String(column.key)}>
                                                {String(row[column.key])}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                                {paginatedData.length !== pageSize && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            style={{ height: `${rowHeight * (pageSize - paginatedData.length)}px` }}
                                        />
                                    </TableRow>
                                )}
                            </>
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
                    Showing {paginatedData.length} of {filteredAndSortedData.length} results
                </div>
                <div className="space-x-2">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                />
                            </PaginationItem>

                            {getVisiblePages().map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === '...' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            onClick={() => handlePageChange(Number(page))}
                                            isActive={page === currentPage}
                                            className="cursor-pointer">
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={
                                        currentPage === totalPages.length
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
};
