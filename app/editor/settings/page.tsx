'use client';

import { useState } from 'react';
import { Save, User, Key, Bell, Shield, Globe } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Pengaturan berhasil disimpan!');
        } catch (error) {
            toast.error('Gagal menyimpan pengaturan');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 pb-20 lg:pb-0 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
                    <p className="mt-1 text-muted-foreground">Kelola profil dan preferensi akun Anda</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            {/* Profile Settings */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Profil</h2>
                        <p className="text-sm text-muted-foreground">Informasi dasar akun Anda</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Nama Lengkap</label>
                        <input
                            type="text"
                            defaultValue="Editor"
                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                        <input
                            type="email"
                            defaultValue="editor@sekolah.com"
                            disabled
                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-muted-foreground cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                        <Key className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Keamanan</h2>
                        <p className="text-sm text-muted-foreground">Kelola password dan keamanan akun</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Password Saat Ini</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                        />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Password Baru</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Konfirmasi Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                        <Bell className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Notifikasi</h2>
                        <p className="text-sm text-muted-foreground">Preferensi notifikasi</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-muted/50 rounded-xl cursor-pointer">
                        <div>
                            <p className="text-sm font-medium text-foreground">Notifikasi Email</p>
                            <p className="text-xs text-muted-foreground">Dapatkan notifikasi melalui email</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-yellow-500 bg-slate-700 border-border rounded focus:ring-yellow-500" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-muted/50 rounded-xl cursor-pointer">
                        <div>
                            <p className="text-sm font-medium text-foreground">Notifikasi Perubahan</p>
                            <p className="text-xs text-muted-foreground">Notifikasi saat konten dipublikasikan</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 text-yellow-500 bg-slate-700 border-border rounded focus:ring-yellow-500" />
                    </label>
                </div>
            </div>

            {/* Role Info */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Role & Akses</h2>
                        <p className="text-sm text-muted-foreground">Informasi hak akses Anda</p>
                    </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">Role</span>
                        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-medium">Editor</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Sebagai Editor, Anda memiliki akses penuh untuk mengelola konten landing page termasuk Hero, About, Features, Testimonials, Contact, dan Footer.
                    </p>
                </div>
            </div>
        </div>
    );
}
