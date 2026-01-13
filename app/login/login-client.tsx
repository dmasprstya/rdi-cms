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

    // Helper function to map role to route
    const getRoleBasedRoute = (role: string): string => {
        const roleRoutes: Record<string, string> = {
            student: '/student',
            editor: '/editor',
            guru: '/guru',
            staff: '/staff',
            admin: '/dashboard',
        };
        return roleRoutes[role] || '/dashboard';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Step 1: Authenticate user
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
                setIsLoading(false);
                return;
            }

            // Step 2: Fetch session explicitly to get user role
            toast({
                title: 'Login Berhasil',
                description: 'Mengarahkan...',
            });

            try {
                const sessionResponse = await fetch('/api/auth/session', {
                    cache: 'no-store',
                });

                if (!sessionResponse.ok) {
                    throw new Error('Failed to fetch session');
                }

                const session = await sessionResponse.json();
                const userRole = session?.user?.role;

                if (!userRole) {
                    console.warn('No role found in session, redirecting to default dashboard');
                }

                // Step 3: Redirect based on role
                const targetRoute = getRoleBasedRoute(userRole || 'admin');
                router.push(targetRoute);
                router.refresh();
            } catch (sessionError) {
                console.error('Error fetching session:', sessionError);
                toast({
                    title: 'Peringatan',
                    description: 'Berhasil login, mengarahkan ke halaman default...',
                    variant: 'default',
                });
                // Fallback to dashboard if session fetch fails
                router.push('/dashboard');
                router.refresh();
            }
        } catch (error) {
            console.error('Login error:', error);
            toast({
                title: 'Error',
                description: 'Terjadi kesalahan saat login',
                variant: 'destructive',
            });
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
                        </form>
                    </CardContent>
                </Card>
            </div>
        </ThemeBackground>
    );
}
