import { useState } from 'react';
import { Input } from '../input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';

interface TableToolbarProps {
    pageSizeOptions: number[];
    defaultPageSize: number;
    onInputChange?: (value: string) => void;
    onPageSizeChange?: (value: number) => void;
}

export function TableToolbar({ onInputChange, pageSizeOptions, defaultPageSize, onPageSizeChange }: TableToolbarProps) {
    const [search, setSearch] = useState('');
    const [pageSize, setPageSize] = useState(defaultPageSize);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange?.(event.target.value);
        setSearch(event.target.value);
    };

    const handlePageSizeChange = (value: string) => {
        const newSize = Number(value);
        setPageSize(newSize);
        onPageSizeChange?.(newSize);
    };

    return (
        <div className="flex items-center justify-between py-4">
            <Input placeholder="Search..." value={search} onChange={handleInputChange} className="max-w-sm" />
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
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
    );
}
