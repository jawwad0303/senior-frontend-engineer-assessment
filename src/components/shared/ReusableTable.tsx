import React, { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import CustomPagination from "@/components/shared/CustomPagination";

interface Column {
    key: string;
    title: string;
    render?: (value: any, row: any) => React.ReactNode;
    sortable?: boolean;

}

interface FilterOption {
    label: string;
    key: string;
    options: string[];
}

interface ActionOption {
    label: string;
    value: string;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    filters?: FilterOption[];
    actionOptions?: ActionOption[];
    onActionSelect?: (action: string, row: any) => void;
    pageSize?: number;
    onRowClick?: (row: any) => void;
    getRowActions?: (row: any) => ActionOption[];

}

function getValue(obj: any, path: string): any {
    if (!obj || typeof path !== "string" || path.trim() === "") {
        console.warn("Invalid object or path:", obj, path);
        return undefined;
    }
    try {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
    } catch (err) {
        console.error("Failed to get value from path", path, "on", obj, err);
        return undefined;
    }
}


export const DataTable: React.FC<DataTableProps> = ({
    columns,
    data,
    filters = [],
    pageSize = 10,
    onActionSelect,
    onRowClick,
    getRowActions
}) => {
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPageSize, setCurrentPageSize] = useState(pageSize || 10);


    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            return filters.every((filter) => {
                const value = filterValues[filter.key];
                const actual = getValue(row, filter.key);
                return !value || value === "__all__" || String(actual) === String(value);
            });
        });
    }, [data, filterValues, filters]);


    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortOrder === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortKey, sortOrder]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * currentPageSize;
        return sortedData.slice(startIndex, startIndex + currentPageSize);
    }, [sortedData, currentPage, currentPageSize]);



    return (
        <Card className="overflow-x-auto rounded-lg bg-white shadow-md px-4 py-6 border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {filters.map((filter) => (
                    <div key={filter.key} className="w-full">
                        <Select
                            onValueChange={(value) =>
                                setFilterValues((prev) => ({ ...prev, [filter.key]: value }))
                            }
                            value={filterValues[filter.key] || ""}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={`Filter by ${filter.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__all__">All</SelectItem>
                                {filter.options.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}

            </div>
            {Object.keys(filterValues).length > 0 && (
                <div className="mx-4 mb-4 flex flex-wrap items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white p-2 shadow-sm">
                    {Object.entries(filterValues).map(([key, value]) => (
                        <span
                            key={key}
                            className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 shadow-sm"
                        >
                            {value}
                            <button
                                onClick={() =>
                                    setFilterValues((prev) => {
                                        const newFilters = { ...prev };
                                        delete newFilters[key];
                                        return newFilters;
                                    })
                                }
                                className="ml-2 text-blue-800 hover:text-blue-900"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                    <button
                        onClick={() => setFilterValues({})}
                        className="ml-auto rounded-md bg-red-100 px-4 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                        Clear All
                    </button>
                </div>
            )}



            <Table className="mt-4">
                <TableHeader>
                    <TableRow className="bg-blue-50 text-blue-800">
                        {columns.map((col) => (
                            <TableHead
                                key={col.key}
                                onClick={() => col.sortable && handleSort(col.key)}
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-${col.sortable ? "pointer" : "default"}`}
                            >
                                {col.title}{" "}
                                {col.sortable && sortKey === col.key && (
                                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                                )}
                            </TableHead>
                        ))}
                        {data.some(row => (getRowActions?.(row)?.length ?? 0) > 0) && (
                            <TableHead className="px-6 py-3 text-center text-xs font-semibold uppercase">
                                Action
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {paginatedData.map((row, idx) => (
                        <TableRow key={idx} onClick={() => onRowClick?.(row)} className="cursor-pointer hover:bg-gray-50">
                            {columns.map((col) => (
                                <TableCell key={col.key} className="px-6 py-4">
                                    {col.render ? col.render(getValue(row, col.key), row) : getValue(row, col.key) || "-"}
                                </TableCell>
                            ))}
                            {(getRowActions?.(row)?.length ?? 0) > 0 && (
                                <TableCell>
                                    <Select onValueChange={(value) => onActionSelect?.(value, row)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose Action" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(getRowActions?.(row) ?? []).map((action) => (
                                                <SelectItem key={action.value} value={action.value}>
                                                    {action.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            )}

                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-6 flex justify-end align-middle items-center">
                <CustomPagination
                    total={sortedData.length}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    count={sortedData.length}
                />
                <div className="mb-4 flex justify-end">
                    <Select
                        value={String(currentPageSize)}
                        onValueChange={(value) => {
                            setCurrentPageSize(Number(value));
                            setCurrentPage(1); // reset to first page
                        }}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Page size" />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20, 50, 100].map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    Show {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>
        </Card>
    );
};
