"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error("QuickPicQR Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl font-bold text-gray-900">
                Something went wrong
            </h1>

            <p className="mt-4 text-lg text-gray-600 max-w-md">
                An unexpected error occurred while loading this page on
                <span className="font-semibold"> QuickPicQR</span>. Please try
                again or return to the homepage.
            </p>

            <div className="mt-6 flex gap-4">
                <button
                    onClick={() => reset()}
                    className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
                >
                    Try again
                </button>

                <Link
                    href="/"
                    className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                    Go home
                </Link>
            </div>
        </div>
    );
}
