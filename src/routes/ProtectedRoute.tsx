import { db } from '@/hooks/useInstantDb';
import Login from '@/pages/Auth/Login';
import React from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading } = db.useAuth();

    // Saat masih loading
    if (isLoading) {
        return (
            <div className="bg-background flex h-screen flex-col items-center justify-center">
                <div className="border-muted border-t-primary h-12 w-12 animate-spin rounded-full border-4"></div>
                <p className="text-muted-foreground mt-4 text-sm">Memuat data pengguna...</p>
            </div>
        );
    }

    // Kalau belum login
    if (!user) {
        return <Login />;
    }

    // Kalau sudah login
    return <>{children}</>;
}
