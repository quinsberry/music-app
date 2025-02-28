import { useState } from 'react';
import { Input } from '../input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { useTableContext } from './table-context';

interface TableToolbarProps {
    pageSizeOptions: number[];
    onInputChange?: (value: string) => void;
    onPageSizeChange?: (value: number) => void;
}

export function TableToolbar({ onInputChange, pageSizeOptions, onPageSizeChange }: TableToolbarProps) {
    const { pageSize, setPageSize } = useTableContext();
    const [search, setSearch] = useState('');
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange?.(event.target.value);
        setSearch(event.target.value);
    };
    return (
        <div className="flex items-center justify-between py-4">
            <Input placeholder="Search..." value={search} onChange={handleInputChange} className="max-w-sm" />
            <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                    const newSize = Number(value);
                    onPageSizeChange?.(newSize);
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
    );
}
