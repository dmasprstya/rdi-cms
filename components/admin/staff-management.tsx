'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UserPlus, Search, Pencil, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Staff {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    createdAt: string;
}

interface StaffFormData {
    id?: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}

const initialFormData: StaffFormData = {
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
};

export function StaffManagement() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState<StaffFormData>(initialFormData);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const { toast } = useToast();

    const fetchStaff = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/staff-users');
            if (response.ok) {
                const data = await response.json();
                setStaff(data);
            } else {
                toast({
                    title: 'Error',
                    description: 'Gagal memuat data staff',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
            toast({
                title: 'Error',
                description: 'Gagal memuat data staff',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingStaff(null);
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            toast({
                title: 'Error',
                description: 'Nama, email, dan password wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/staff-users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Data staff berhasil ditambahkan',
                });
                setIsAddDialogOpen(false);
                resetForm();
                fetchStaff();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal menambahkan data staff',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error adding staff:', error);
            toast({
                title: 'Error',
                description: 'Gagal menambahkan data staff',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (staffMember: Staff) => {
        setEditingStaff(staffMember);
        setFormData({
            id: staffMember.id,
            name: staffMember.name,
            email: staffMember.email,
            password: '',
            phone: staffMember.phone || '',
            address: staffMember.address || '',
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateStaff = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            toast({
                title: 'Error',
                description: 'Nama dan email wajib diisi',
                variant: 'destructive',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/staff-users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Data staff berhasil diperbarui',
                });
                setIsEditDialogOpen(false);
                resetForm();
                fetchStaff();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal memperbarui data staff',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error updating staff:', error);
            toast({
                title: 'Error',
                description: 'Gagal memperbarui data staff',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStaff = async (staffId: string) => {
        try {
            const response = await fetch(`/api/staff-users?id=${staffId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: 'Berhasil',
                    description: 'Data staff berhasil dihapus',
                });
                fetchStaff();
            } else {
                toast({
                    title: 'Error',
                    description: data.error || 'Gagal menghapus data staff',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
            toast({
                title: 'Error',
                description: 'Gagal menghapus data staff',
                variant: 'destructive',
            });
        }
    };

    // Filter staff based on search - Memoized for performance
    const filteredStaff = useMemo(() => {
        return staff.filter(staffMember =>
            staffMember.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staffMember.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [staff, searchQuery]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Kelola Staff</h2>
                    <p className="text-muted-foreground mt-1">
                        Tambah, edit, dan kelola data staff
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => {
                                resetForm();
                                setIsAddDialogOpen(true);
                            }}
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Tambah Staff
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-card">
                        <DialogHeader>
                            <DialogTitle className="text-foreground">Tambah Staff Baru</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Masukkan data staff baru di bawah ini
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddStaff}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right text-foreground">
                                        Nama <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="Nama lengkap staff"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right text-foreground">
                                        Email <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="email@sekolah.com"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="password" className="text-right text-foreground">
                                        Password <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="col-span-3 relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="pr-10"
                                            placeholder="Password untuk login"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right text-foreground">
                                        No. Telepon
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="address" className="text-right text-foreground">
                                        Alamat
                                    </Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                        placeholder="Alamat lengkap"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari staff berdasarkan nama atau email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Staff Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Staff ({filteredStaff.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">Memuat data...</span>
                        </div>
                    ) : filteredStaff.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {staff.length === 0
                                ? 'Belum ada data staff. Klik "Tambah Staff" untuk menambahkan data.'
                                : 'Tidak ada staff yang sesuai dengan pencarian.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-border">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Nama</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Email</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">No. Telepon</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredStaff.map((staffMember) => (
                                        <tr key={staffMember.id} className="hover:bg-muted/50">
                                            <td className="py-3 px-4 text-sm text-foreground font-medium">{staffMember.name}</td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">{staffMember.email}</td>
                                            <td className="py-3 px-4 text-sm text-muted-foreground">
                                                {staffMember.phone || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditClick(staffMember)}
                                                    >
                                                        <Pencil className="w-3 h-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="destructive">
                                                                <Trash2 className="w-3 h-3 mr-1" />
                                                                Hapus
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="bg-card">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className="text-foreground">
                                                                    Hapus Data Staff?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription className="text-muted-foreground">
                                                                    Apakah Anda yakin ingin menghapus data staff <strong>{staffMember.name}</strong>?
                                                                    Tindakan ini tidak dapat dibatalkan dan akan menghapus akun login staff.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                                    onClick={() => handleDeleteStaff(staffMember.id)}
                                                                >
                                                                    Ya, Hapus
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-card">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">Edit Data Staff</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Perbarui data staff di bawah ini
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateStaff}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right text-foreground">
                                    Nama <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="Nama lengkap staff"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-email" className="text-right text-foreground">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="edit-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="email@sekolah.com"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-password" className="text-right text-foreground">
                                    Password
                                </Label>
                                <div className="col-span-3 relative">
                                    <Input
                                        id="edit-password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="pr-10"
                                        placeholder="Kosongkan jika tidak ingin mengubah"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-phone" className="text-right text-foreground">
                                    No. Telepon
                                </Label>
                                <Input
                                    id="edit-phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-address" className="text-right text-foreground">
                                    Alamat
                                </Label>
                                <Input
                                    id="edit-address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                    placeholder="Alamat lengkap"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditDialogOpen(false);
                                    resetForm();
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={isSubmitting}
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
