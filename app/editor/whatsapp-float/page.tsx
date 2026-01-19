'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Save, Eye, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppFloatContent {
    enabled: boolean;
    phoneNumber: string;
    defaultMessage: string;
    position: 'right' | 'left';
    tooltipText: string;
}

export default function WhatsAppFloatEditor() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDisableDialog, setShowDisableDialog] = useState(false);
    const [pendingEnabled, setPendingEnabled] = useState<boolean | null>(null);
    const [phoneError, setPhoneError] = useState('');

    const [content, setContent] = useState<WhatsAppFloatContent>({
        enabled: true,
        phoneNumber: '6281234567890',
        defaultMessage: 'Halo, saya ingin bertanya tentang program RDI',
        position: 'right',
        tooltipText: 'Chat dengan kami via WhatsApp',
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/cms/rdi?section=rdi-whatsapp-float');
                const data = await response.json();

                if (data.success && data.data) {
                    setContent(data.data.content as WhatsAppFloatContent);
                }
            } catch (error) {
                console.error('Error fetching content:', error);
                toast({
                    title: 'Error',
                    description: 'Gagal memuat konten',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [toast]);

    // Real-time phone number validation
    const validatePhoneNumber = (phone: string): boolean => {
        // Must start with 62
        if (!phone.startsWith('62')) {
            setPhoneError('Nomor harus dimulai dengan 62');
            return false;
        }

        // Only numbers
        if (!/^\d+$/.test(phone)) {
            setPhoneError('Hanya boleh angka (tanpa spasi atau tanda hubung)');
            return false;
        }

        // Length validation
        if (phone.length < 10 || phone.length > 15) {
            setPhoneError('Panjang nomor harus antara 10-15 digit');
            return false;
        }

        setPhoneError('');
        return true;
    };

    const handlePhoneChange = (value: string) => {
        setContent({ ...content, phoneNumber: value });
        validatePhoneNumber(value);
    };

    const handleEnabledChange = (checked: boolean) => {
        // Show confirmation dialog if disabling an already active button
        if (!checked && content.enabled) {
            setPendingEnabled(false);
            setShowDisableDialog(true);
        } else {
            setContent({ ...content, enabled: checked });
        }
    };

    const confirmDisable = () => {
        setContent({ ...content, enabled: false });
        setShowDisableDialog(false);
        setPendingEnabled(null);
    };

    const cancelDisable = () => {
        setShowDisableDialog(false);
        setPendingEnabled(null);
    };

    const handleSave = async () => {
        // Validate before saving
        if (!validatePhoneNumber(content.phoneNumber)) {
            toast({
                title: 'Validasi Gagal',
                description: 'Periksa kembali nomor WhatsApp',
                variant: 'destructive',
            });
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/cms/rdi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    section: 'rdi-whatsapp-float',
                    content,
                    isPublished: true,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: 'Berhasil',
                    description: 'Konfigurasi WhatsApp Float Button berhasil disimpan',
                });
            } else {
                throw new Error(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            toast({
                title: 'Error',
                description: 'Gagal menyimpan konten',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    const messageLength = content.defaultMessage.length;
    const maxMessageLength = 500;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 lg:pb-0">
            {/* Disable Confirmation Dialog */}
            <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Nonaktifkan Tombol WhatsApp?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tombol WhatsApp yang sedang aktif akan dihilangkan dari landing page.
                            Pengunjung tidak akan bisa menghubungi Anda melalui tombol floating ini.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelDisable}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDisable}>
                            Ya, Nonaktifkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/editor"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">
                        Edit WhatsApp Float Button
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Kelola tombol WhatsApp mengambang di landing page
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/" target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                        </Link>
                    </Button>
                    <Button onClick={handleSave} disabled={saving || !!phoneError}>
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Simpan
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Enable/Disable Toggle */}
            <Card>
                <CardHeader>
                    <CardTitle>Status Tombol</CardTitle>
                    <CardDescription>
                        Aktifkan atau nonaktifkan tombol WhatsApp di landing page
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="enabled">Aktifkan Tombol WhatsApp</Label>
                            <p className="text-sm text-muted-foreground">
                                Tombol akan muncul di kanan/kiri bawah landing page
                            </p>
                        </div>
                        <Switch
                            id="enabled"
                            checked={content.enabled}
                            onCheckedChange={handleEnabledChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* WhatsApp Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>Konfigurasi WhatsApp</CardTitle>
                    <CardDescription>
                        Atur nomor dan pesan default untuk tombol WhatsApp
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">
                            Nomor WhatsApp <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="phoneNumber"
                            value={content.phoneNumber}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="6281234567890"
                            className={phoneError ? 'border-destructive' : ''}
                        />
                        {phoneError ? (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                                <AlertCircle className="w-4 h-4" />
                                {phoneError}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                Format: 62xxxxxxxxxx (tanpa +, spasi, atau tanda hubung)
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="defaultMessage">Pesan Default</Label>
                            <span
                                className={`text-xs ${messageLength > maxMessageLength
                                    ? 'text-destructive font-semibold'
                                    : 'text-muted-foreground'
                                    }`}
                            >
                                {messageLength}/{maxMessageLength} karakter
                            </span>
                        </div>
                        <Textarea
                            id="defaultMessage"
                            value={content.defaultMessage}
                            onChange={(e) =>
                                setContent({ ...content, defaultMessage: e.target.value })
                            }
                            placeholder="Halo, saya ingin bertanya tentang program RDI"
                            rows={3}
                            className={messageLength > maxMessageLength ? 'border-destructive' : ''}
                        />
                        <p className="text-xs text-muted-foreground">
                            Pesan ini akan otomatis muncul saat pengunjung klik tombol WhatsApp
                        </p>
                        {/* Live Preview */}
                        {content.defaultMessage && (
                            <div className="mt-2 p-3 bg-muted rounded-md border">
                                <p className="text-xs font-semibold text-muted-foreground mb-1">
                                    Preview Pesan:
                                </p>
                                <p className="text-sm">{content.defaultMessage}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Display Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Pengaturan Tampilan</CardTitle>
                    <CardDescription>
                        Atur posisi dan teks tooltip tombol
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <Label htmlFor="position">Posisi Tombol</Label>
                        <Select
                            value={content.position}
                            onValueChange={(value: 'right' | 'left') =>
                                setContent({ ...content, position: value })
                            }
                        >
                            <SelectTrigger id="position">
                                <SelectValue placeholder="Pilih posisi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="right">Kanan Bawah (Recommended)</SelectItem>
                                <SelectItem value="left">Kiri Bawah</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tooltipText">Text Tooltip (saat hover)</Label>
                        <Input
                            id="tooltipText"
                            value={content.tooltipText}
                            onChange={(e) =>
                                setContent({ ...content, tooltipText: e.target.value })
                            }
                            placeholder="Chat dengan kami via WhatsApp"
                        />
                        <p className="text-xs text-muted-foreground">
                            Teks yang muncul saat pengunjung mengarahkan kursor ke tombol
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
