import { Loader2 } from 'lucide-react';

export default function StaffLoading() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                <p className="text-sm text-muted-foreground">Memuat...</p>
            </div>
        </div>
    );
}
