'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Hardcoded admin credentials for demonstration
        const adminEmail = "laibaashfaqahmed232@gmail.com";//your email
        const adminPassword = "2507laiba"; // Replace with a secure method

        if (email === adminEmail && password === adminPassword) {
            router.push("/admin/dashboard"); // Redirect to admin dashboard
        } else {
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>
                {error && <p className="text-red-500 text-center mb-2">{error}</p>}
                <form onSubmit={handleLogin} className="flex flex-col">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-3 p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-3 p-2 border rounded"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
