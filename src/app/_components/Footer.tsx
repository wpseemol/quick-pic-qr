export default function Footer() {
    return (
        // Footer
        <footer className="mt-auto border-t border-[#e8f3f3] bg-white py-12">
            <div className="mx-auto container px-6">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-font-color">
                            <span className="material-symbols-outlined text-lg font-bold">
                                bolt
                            </span>
                        </div>
                        <h2 className="text-lg font-extrabold">
                            Upload &amp; Share
                        </h2>
                    </div>
                    <div className="flex gap-8 text-sm font-medium text-[#4e6b6b]">
                        <a className="hover:text-primary" href="#">
                            Privacy Policy
                        </a>
                        <a className="hover:text-primary" href="#">
                            Terms of Service
                        </a>
                        <a className="hover:text-primary" href="#">
                            Support
                        </a>
                        <a className="hover:text-primary" href="#">
                            API
                        </a>
                    </div>
                    <div className="flex gap-4">
                        <a
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f9fafa] text-font-color hover:bg-primary transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined text-xl">
                                language
                            </span>
                        </a>
                        <a
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f9fafa] text-font-color hover:bg-primary transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined text-xl">
                                alternate_email
                            </span>
                        </a>
                    </div>
                </div>
                <div className="mt-8 border-t border-[#e8f3f3] pt-8 text-center text-xs text-[#4e6b6b]/60">
                    ©{" "}
                    {
                        // get current year.
                        new Date().getFullYear()
                    }{" "}
                    Upload &amp; Share Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
