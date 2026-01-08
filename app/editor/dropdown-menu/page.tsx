'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface DropdownMenuItem {
    id: string;
    title: string;
    slug: string;
    content: any;
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function DropdownMenuEditor() {
    const [items, setItems] = useState<DropdownMenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<DropdownMenuItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [tableNotFound, setTableNotFound] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: {
            heading: '',
            description: '',
            features: [] as string[],
        },
        order: 0,
        isPublished: true,
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('/api/dropdown-menu/manage');
            const data = await response.json();

            if (data.success) {
                setItems(data.data);
                setTableNotFound(false);
            } else {
                // Check if error is related to table not existing
                if (data.error && data.error.includes('does not exist')) {
                    setTableNotFound(true);
                } else {
                    alert('Gagal memuat menu dropdown');
                }
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            const errorMessage = error instanceof Error ? error.message : '';
            if (errorMessage.includes('does not exist')) {
                setTableNotFound(true);
            } else {
                alert('Terjadi kesalahan saat memuat data');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = '/api/dropdown-menu/manage';
            const method = editingItem ? 'PUT' : 'POST';

            const payload = editingItem
                ? { id: editingItem.id, ...formData }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                alert(editingItem ? 'Menu berhasil diupdate' : 'Menu berhasil ditambahkan');
                fetchItems();
                resetForm();
                setIsDialogOpen(false);
            } else {
                alert(data.error || 'Gagal menyimpan menu');
            }
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Terjadi kesalahan saat menyimpan');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus menu ini?')) return;

        try {
            const response = await fetch(`/api/dropdown-menu/manage?id=${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                alert('Menu berhasil dihapus');
                fetchItems();
            } else {
                alert(data.error || 'Gagal menghapus menu');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Terjadi kesalahan saat menghapus');
        }
    };

    const handleEdit = (item: DropdownMenuItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            slug: item.slug,
            content: item.content,
            order: item.order,
            isPublished: item.isPublished,
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingItem(null);
        setFormData({
            title: '',
            slug: '',
            content: {
                heading: '',
                description: '',
                features: [],
            },
            order: 0,
            isPublished: true,
        });
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            content: {
                ...formData.content,
                features: [...formData.content.features, ''],
            },
        });
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...formData.content.features];
        newFeatures[index] = value;
        setFormData({
            ...formData,
            content: {
                ...formData.content,
                features: newFeatures,
            },
        });
    };

    const removeFeature = (index: number) => {
        const newFeatures = formData.content.features.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            content: {
                ...formData.content,
                features: newFeatures,
            },
        });
    };

    if (loading && items.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Kelola Menu Dropdown Kemitraan
                    </h1>
                    <p className="text-muted-foreground">
                        Tambah, edit, atau hapus menu dropdown pada navbar landing page
                    </p>
                </div>
                <Button
                    onClick={() => {
                        resetForm();
                        setIsDialogOpen(true);
                    }}
                    className="bg-primary hover:bg-primary/90"
                    disabled={tableNotFound}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Menu
                </Button>
            </div>

            {/* Setup Banner */}
            {tableNotFound && (
                <div className="mb-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-yellow-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Database Setup Diperlukan
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Tabel <code className="px-2 py-1 bg-muted rounded">dropdown_menu</code> belum dibuat.
                                Anda perlu menjalankan setup database terlebih dahulu untuk menggunakan fitur ini.
                            </p>
                            <a
                                href="/editor/setup"
                                className="inline-flex items-center justify-center px-4 py-2 bg-yellow-500 text-foreground rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                            >
                                Jalankan Setup Database
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Items List */}
            <div className="grid gap-4 mb-8">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-semibold text-foreground">
                                        {item.title}
                                    </h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                        /{item.slug}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                        Order: {item.order}
                                    </span>
                                    {item.isPublished ? (
                                        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                                            <Eye className="w-3 h-3" />
                                            Published
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                            <EyeOff className="w-3 h-3" />
                                            Draft
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {item.content?.heading || 'No heading'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Updated: {new Date(item.updatedAt).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(item)}
                                    className="hover:bg-primary/10 hover:text-primary"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                    className="hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-12 bg-card border border-border rounded-lg">
                        <p className="text-muted-foreground">
                            Belum ada menu dropdown. Klik &quot;Tambah Menu&quot; untuk membuat yang pertama.
                        </p>
                    </div>
                )}
            </div>

            {/* Dialog Form */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-foreground mb-6">
                            {editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Judul Menu
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Contoh: Jerman"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Slug (URL)
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="contoh: jerman"
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    URL akan menjadi: /{formData.slug || 'slug'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Heading Halaman
                                </label>
                                <input
                                    type="text"
                                    value={formData.content.heading}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            content: { ...formData.content, heading: e.target.value },
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Contoh: Program Kemitraan Jerman"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={formData.content.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            content: { ...formData.content, description: e.target.value },
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows={4}
                                    placeholder="Deskripsi program kemitraan..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Fitur / Keunggulan
                                </label>
                                {formData.content.features.map((feature, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateFeature(index, e.target.value)}
                                            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder={`Fitur ${index + 1}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => removeFeature(index)}
                                            className="hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addFeature}
                                    className="w-full mt-2"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Fitur
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Urutan Tampilan
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) =>
                                            setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                                        }
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.isPublished ? 'published' : 'draft'}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                isPublished: e.target.value === 'published',
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-primary hover:bg-primary/90"
                                    disabled={loading}
                                >
                                    {loading ? 'Menyimpan...' : editingItem ? 'Update Menu' : 'Tambah Menu'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        resetForm();
                                        setIsDialogOpen(false);
                                    }}
                                    disabled={loading}
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
