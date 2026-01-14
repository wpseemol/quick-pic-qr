export default function Header() {
    return (
        //  Navigation Bar
        <header className=" sticky top-0 z-50 w-full border-b border-solid border-[#e8f3f3] bg-background-light/80 backdrop-blur-md px-6 md:px-20 py-4">
            <div className="mx-auto flex items-center justify-between container">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-[#0e1b1b]">
                        <span className="material-symbols-outlined font-bold">
                            bolt
                        </span>
                    </div>
                    <h2 className="text-xl font-extrabold tracking-tight">
                        Upload &amp; Share
                    </h2>
                </div>
                <div className="flex items-center gap-6 md:gap-10">
                    <a
                        className="hidden text-sm font-semibold hover:text-primary transition-colors md:block"
                        href="#"
                    >
                        My Gallery
                    </a>
                    <a
                        className="hidden text-sm font-semibold hover:text-primary transition-colors md:block"
                        href="#"
                    >
                        Pricing
                    </a>
                    <button className="flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold shadow-sm transition-transform active:scale-95">
                        Start Sharing
                    </button>
                </div>
            </div>
        </header>
    );
}
