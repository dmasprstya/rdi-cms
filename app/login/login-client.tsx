'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NavigationControls } from '@/components/navigation-controls';
import { ThemeBackground } from '@/components/theme-background';
import Image from 'next/image';

interface LoginClientProps {
    logoUrl?: string;
    logoTextColor?: string;
}

export function LoginClient({ logoUrl, logoTextColor }: LoginClientProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast({
                    title: 'Login Gagal',
                    description: 'Email atau password salah',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Login Berhasil',
                    description: 'Selamat datang!',
                });
                router.push('/dashboard');
                router.refresh();
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Terjadi kesalahan saat login',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeBackground>
            <div className="min-h-screen flex items-center justify-center p-4">
                {/* Navigation Controls */}
                <div className="absolute top-4 left-4 z-20">
                    <NavigationControls showForward={false} forceBackToPath="/" />
                </div>

                <Card className="w-full max-w-md relative z-10">
                    <CardHeader className="space-y-4 text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            {logoUrl ? (
                                <div className="relative w-12 h-12">
                                    <Image
                                        src={logoUrl}
                                        alt="Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <GraduationCap className="w-10 h-10 text-primary" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Selamat Datang</CardTitle>
                            <CardDescription>
                                Masuk ke Sistem Rosman Djohan Institute
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground" htmlFor="email">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nama@sekolah.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Memproses...' : 'Masuk'}
                            </Button>

                            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                                <p className="text-xs text-muted-foreground text-center mb-2">Demo Akun:</p>
                                <p className="text-xs text-foreground">Admin: admin@sekolah.com / admin123</p>
                                <p className="text-xs text-foreground">Siswa: siswa@sekolah.com / siswa123</p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </ThemeBackground>
    );
}
