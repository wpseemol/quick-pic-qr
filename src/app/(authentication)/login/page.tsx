import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
    return (
        <main className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-120 animate-in fade-in  duration-700">
                <div className="bg-white p-8 lg:p-12 rounded-xl shadow-xl border border-custom-primary/20">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-custom-primary/10 text-custom-primary mb-6">
                            <span className="material-symbols-outlined text-9xl">
                                qr_code_2
                            </span>
                        </div>
                        <h1 className="text-[#101819] tracking-tight text-3xl font-bold leading-tight mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 text-base font-normal">
                            Access your gallery and share instantly with QR
                            codes
                        </p>
                    </div>

                    <LoginForm />
                </div>
            </div>

            {/* Decorative Elements  */}
            <div className="fixed top-20 left-20 opacity-10 pointer-events-none hidden lg:block">
                <span className="material-symbols-outlined scale-[400%] text-custom-primary">
                    qr_code_2
                </span>
            </div>
            <div className="fixed bottom-20 right-20 opacity-10 pointer-events-none hidden lg:block">
                <span className="material-symbols-outlined scale-[400%] text-custom-primary">
                    photo_library
                </span>
            </div>
        </main>
    );
}
