import { ClassesManagement } from '@/components/admin/classes-management';

export default function ClassesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Kelola Kelas</h2>
                <p className="text-muted-foreground mt-1">
                    Manajemen data kelas sekolah
                </p>
            </div>
            <ClassesManagement />
        </div>
    );
}
