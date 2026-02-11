"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
                    <div className="max-w-md text-center">
                        <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
                        <p className="mb-6 text-gray-600">
                            A critical error occurred. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => reset()}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
