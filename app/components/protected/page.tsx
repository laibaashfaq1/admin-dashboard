'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRouter({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Ensure it's client-side before checking localStorage

        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            router.replace("/admin/dashboard"); // Use `replace` to prevent back navigation
        }
    }, [router]);

    if (!isClient) return null; // Prevent SSR-related issues

    return <>{children}</>;
}
