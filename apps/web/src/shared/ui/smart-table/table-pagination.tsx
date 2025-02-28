import { useState } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../pagination';

interface TablePaginationProps {
    onPageChange?: (page: number) => void;
    itemsCount: number;
    totalPages: number;
    totalItems: number;
}

export function TablePagination({ onPageChange, itemsCount, totalPages, totalItems }: TablePaginationProps) {
    const [pagination, setPagination] = useState({
        page: 1,
        nextPage: totalPages > 1 ? 2 : null,
        prevPage: null as number | null,
    });

    const pages = new Array(totalPages).fill(0).map((_, index) => index + 1);

    const handlePageChange = (page: number) => {
        onPageChange?.(page);
        setPagination({
            page,
            nextPage: page + 1 > totalPages ? null : page + 1,
            prevPage: page - 1 < 1 ? null : page - 1,
        });
    };

    const handleNextPage = () => {
        if (pagination.nextPage) {
            handlePageChange(pagination.nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (pagination.prevPage) {
            handlePageChange(pagination.prevPage);
        }
    };

    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                {itemsCount}/{totalItems}
            </div>
            <div className="space-x-2">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={handlePreviousPage} />
                        </PaginationItem>
                        {pages.map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === pagination.page}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext href="#" onClick={handleNextPage} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
