import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import { useEffect } from "react";

type OptionType = string | { label: string; value: string };

interface Field {
    field: string;
    label: string;
    type: "text" | "select";
    options?: OptionType[];
}

interface TableFilterProps {
    filters: Record<string, string>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    refetch?: (filters: Record<string, string>) => void;
    fields: Field[];
    buttonOrComponentToRender?: React.ReactNode;
}

const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <div className="mr-2 inline-flex h-8 items-center gap-1 rounded-md border border-gray-200 bg-[#f4f5f0] px-3 py-2 text-sm font-semibold text-gray-600">
        <span>{label}</span>
        <button onClick={onRemove} className="ml-1 rounded-full p-0.5 hover:bg-gray-100">
            <X className="size-3" />
        </button>
    </div>
);

const TableFilter: React.FC<TableFilterProps> = ({ filters, setFilters, refetch, fields, buttonOrComponentToRender }) => {
    const handleFilterChange = (field: string, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const removeFilter = (field: string) => {
        setFilters((prev) => {
            const updated = { ...prev };
            delete updated[field];
            return updated;
        });
    };

    useEffect(() => {
        if (refetch) {
            try {
                refetch(filters);
            } catch (e) {
                console.warn("Refetch failed", e);
            }
        }
    }, [filters]);

    return (
        <div className="no-scrollbar w-full overflow-auto">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="flex flex-wrap gap-4">
                    {fields.map(({ field, label, type, options }) => {
                        if (type === "select" && Array.isArray(options)) {
                            return (
                                <Select
                                    key={field}
                                    value={filters[field] || ""}
                                    onValueChange={(value) => handleFilterChange(field, value)}
                                >
                                    <SelectTrigger className="h-11 w-40 border-gray-200">
                                        <SelectValue placeholder={label} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">All</SelectItem>
                                        {options.map((option) => {
                                            if (typeof option === "string") {
                                                return (
                                                    <SelectItem key={option} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                );
                                            }

                                            // Validate object has both value and label
                                            if (typeof option === "object" && option?.value && option?.label) {
                                                return (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                );
                                            }

                                            return null; // Skip invalid option
                                        })}

                                    </SelectContent>
                                </Select>
                            );
                        }
                        return null;
                    })}
                </div>

                {buttonOrComponentToRender && <div>{buttonOrComponentToRender}</div>}
            </div>

            {Object.keys(filters).length > 0 && (
                <div className="mx-4 mb-4 flex flex-wrap items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white p-2 shadow-sm">
                    {Object.entries(filters).map(([key, value]) => (
                        <FilterChip key={key} label={`${key}: ${value}`} onRemove={() => removeFilter(key)} />
                    ))}
                    <button
                        onClick={() => setFilters({})}
                        className="mr-2 flex h-8 items-center gap-1 rounded-md border bg-[#FEF2F2] px-4 text-sm text-red-500"
                    >
                        <FaTrash /> Clear
                    </button>
                </div>
            )}
        </div>
    );
};

export default TableFilter;
