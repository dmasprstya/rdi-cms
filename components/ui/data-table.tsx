import { cn } from "@/lib/utils";

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    className?: string;
    loading?: boolean;
    emptyMessage?: string;
}

export function DataTable<T>({ data, columns, className, loading, emptyMessage }: DataTableProps<T>) {
    if (loading) {
        return (
            <div className={cn("overflow-hidden rounded-lg border border-border p-8", className)}>
                <div className="flex items-center justify-center">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className={cn("overflow-hidden rounded-lg border border-border p-8", className)}>
                <div className="flex items-center justify-center">
                    <div className="text-muted-foreground">{emptyMessage || 'No data available'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                    <tr>
                        {columns.map((column, idx) => (
                            <th
                                key={idx}
                                className={cn(
                                    "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground",
                                    column.className
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                    {data.map((row, rowIdx) => (
                        <tr
                            key={rowIdx}
                            className="transition-colors hover:bg-muted/50"
                        >
                            {columns.map((column, colIdx) => (
                                <td
                                    key={colIdx}
                                    className={cn(
                                        "whitespace-nowrap px-6 py-4 text-sm text-card-foreground",
                                        column.className
                                    )}
                                >
                                    {typeof column.accessor === "function"
                                        ? column.accessor(row)
                                        : String(row[column.accessor])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
