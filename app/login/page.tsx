"use client";

import * as React from "react";
import { LogIn, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple client-side auth (replace with real auth later)
        if (email && password) {
            // Store login state
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", email);

            // Redirect to dashboard
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-pos-xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-success-500 rounded-2xl flex items-center justify-center">
                        <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent">
                            LekhyaAI
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                            GST Accounting & Compliance for Indian SMEs
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        <Button type="submit" size="lg" className="w-full gap-2">
                            <LogIn className="w-5 h-5" />
                            Sign In
                        </Button>

                        <div className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                                Sign up
                            </a>
                        </div>
                    </form>

                    <div className="mt-6 pt-6 border-t text-center">
                        <p className="text-xs text-gray-500">
                            Demo Mode: Use any email and password to login
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
