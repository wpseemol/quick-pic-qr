"use client";

import { useRouter } from "next/navigation";

export default function NotFoundComponent({
    message = "Image Not Found",
    subMessage = "The image you're looking for doesn't exist or has been removed.",
}) {
    const router = useRouter();

    return (
        <div className="min-h-100 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                {/* Icon/Illustration */}
                <div className="mb-6">
                    <div className="relative inline-flex items-center justify-center w-24 h-24">
                        <div className="absolute inset-0 bg-linear-to-br from-red-100 to-pink-100 rounded-full"></div>
                        <svg
                            className="relative w-12 h-12 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                </div>

                {/* Message */}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {message}
                </h3>
                <p className="text-gray-600 mb-8">{subMessage}</p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => router.push("/")}
                        className="px-5 py-2.5 bg-linear-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Back Home
                        </div>
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                        Go Back
                    </button>
                </div>

                {/* Stats or Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Need help?{" "}
                        <a
                            href="/contact"
                            className="text-red-500 hover:text-red-600 font-medium"
                        >
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
