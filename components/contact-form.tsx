'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Mail, User, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

// Zod validation schema
const contactFormSchema = z.object({
    name: z.string()
        .min(2, 'Nama harus minimal 2 karakter')
        .max(50, 'Nama maksimal 50 karakter'),
    email: z.string()
        .email('Format email tidak valid')
        .min(1, 'Email wajib diisi'),
    subject: z.string()
        .min(3, 'Subjek harus minimal 3 karakter')
        .max(100, 'Subjek maksimal 100 karakter'),
    message: z.string()
        .min(10, 'Pesan harus minimal 10 karakter')
        .max(500, 'Pesan maksimal 500 karakter'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        mode: 'onBlur', // Validate on blur
    });

    const messageLength = watch('message')?.length || 0;

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        setSubmitError(false);
        setSubmitSuccess(false);

        try {
            // Submit to Formspree endpoint
            const response = await fetch('https://formspree.io/f/xqarbydw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    subject: data.subject,
                    message: data.message,
                }),
            });

            if (response.ok) {
                // Success
                setSubmitSuccess(true);
                reset();

                // Hide success message after 7 seconds
                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 7000);
            } else {
                // Formspree returned an error
                setSubmitError(true);
            }
        } catch (error) {
            // Network error or other issue
            console.error('Form submission error:', error);
            setSubmitError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Success Message */}
            {submitSuccess && (
                <div className="mb-6 bg-card border border-green-500/30 bg-green-500/10 rounded-xl p-4">
                    <div className="flex items-center gap-3 text-green-400">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Pesan berhasil dikirim!</p>
                            <p className="text-sm text-muted-foreground">Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {submitError && (
                <div className="mb-6 bg-card border border-red-500/30 bg-red-500/10 rounded-xl p-4">
                    <div className="flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Gagal mengirim pesan</p>
                            <p className="text-sm text-muted-foreground">Terjadi kesalahan saat mengirim pesan. Silakan coba lagi atau hubungi kami langsung.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-xl p-8 space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                        Nama Lengkap <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <User className="w-5 h-5" />
                        </div>
                        <input
                            {...register('name')}
                            type="text"
                            id="name"
                            className={`w-full pl-11 pr-4 py-3 bg-background border rounded-lg text-foreground placeholder-muted-foreground 
                                focus:outline-none focus:ring-2 transition-all
                                ${errors.name
                                    ? 'border-red-500 focus:ring-red-500/50'
                                    : 'border-input focus:ring-primary/50 focus:border-primary'
                                }`}
                            placeholder="Masukkan nama lengkap Anda"
                        />
                    </div>
                    {errors.name && (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.name.message}</span>
                        </div>
                    )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                        Email <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            {...register('email')}
                            type="email"
                            id="email"
                            className={`w-full pl-11 pr-4 py-3 bg-background border rounded-lg text-foreground placeholder-muted-foreground 
                                focus:outline-none focus:ring-2 transition-all
                                ${errors.email
                                    ? 'border-red-500 focus:ring-red-500/50'
                                    : 'border-input focus:ring-primary/50 focus:border-primary'
                                }`}
                            placeholder="nama@example.com"
                        />
                    </div>
                    {errors.email && (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.email.message}</span>
                        </div>
                    )}
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground">
                        Subjek <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <input
                            {...register('subject')}
                            type="text"
                            id="subject"
                            className={`w-full pl-11 pr-4 py-3 bg-background border rounded-lg text-foreground placeholder-muted-foreground 
                                focus:outline-none focus:ring-2 transition-all
                                ${errors.subject
                                    ? 'border-red-500 focus:ring-red-500/50'
                                    : 'border-input focus:ring-primary/50 focus:border-primary'
                                }`}
                            placeholder="Topik pesan Anda"
                        />
                    </div>
                    {errors.subject && (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.subject.message}</span>
                        </div>
                    )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-foreground">
                        Pesan <span className="text-primary">*</span>
                    </label>
                    <textarea
                        {...register('message')}
                        id="message"
                        rows={6}
                        className={`w-full px-4 py-3 bg-background border rounded-lg text-foreground placeholder-muted-foreground 
                            focus:outline-none focus:ring-2 transition-all resize-none
                            ${errors.message
                                ? 'border-red-500 focus:ring-red-500/50'
                                : 'border-input focus:ring-primary/50 focus:border-primary'
                            }`}
                        placeholder="Tuliskan pesan Anda di sini..."
                    />
                    <div className="flex items-center justify-between">
                        <div>
                            {errors.message && (
                                <div className="flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.message.message}</span>
                                </div>
                            )}
                        </div>
                        <span className={`text-sm ${messageLength > 500 ? 'text-red-400' : 'text-muted-foreground'}`}>
                            {messageLength}/500
                        </span>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            <span>Mengirim...</span>
                        </div>
                    ) : (
                        'Kirim Pesan'
                    )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                    <span className="text-primary">*</span> Wajib diisi
                </p>
            </form>
        </div>
    );
}
