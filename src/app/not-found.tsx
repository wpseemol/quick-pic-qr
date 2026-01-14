import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>

            <p className="mt-4 text-xl text-gray-600">
                Oops! The page you are looking for doesn’t exist.
            </p>

            <Link
                href="/"
                className="mt-6 inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition"
            >
                Go back home
            </Link>
        </div>
    );
}
