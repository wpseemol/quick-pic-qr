// app/page.tsx
import ImageCard from "./_components/ImageCard";
import { ImageData } from "@/types/image";

export default function GalleryPage() {
    return (
        <main className="container mx-auto px-6 lg:px-20 py-8">
            {/* Hero Section / Upload Area */}
            <section className="mb-12">
                <div className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10">
                    <div className="w-full lg:w-1/2 aspect-video bg-white rounded-xl shadow-sm overflow-hidden flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-primary font-bold">
                                Drop files to upload
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <span className="material-symbols-outlined text-primary text-5xl mb-4">
                                add_photo_alternate
                            </span>
                            <h3 className="text-lg font-bold">
                                Drag and drop images here
                            </h3>
                            <p className="text-[#509595] text-sm">
                                PNG, JPG, GIF up to 20MB
                            </p>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left">
                        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-font-color">
                            Your Creative{" "}
                            <span className="text-primary">Vault</span>
                        </h1>
                        <p className="text-[#509595] text-lg max-w-md mx-auto lg:mx-0">
                            High-speed image hosting with instant QR sharing.
                            Organize your visual inspiration in seconds.
                        </p>
                        <div className="pt-4 flex flex-wrap gap-3 justify-center lg:justify-start">
                            <button className="bg-primary text-font-color px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                                Upload Now
                            </button>
                            <button className="bg-white border border-[#e8f3f3] text-font-color px-8 py-3 rounded-xl font-bold hover:bg-[#f8fbfb] transition-colors">
                                View Plans
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {filterButtons.map((button) => (
                        <button
                            key={button.label}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                button.isActive
                                    ? "bg-primary text-font-color font-bold"
                                    : "bg-[#e8f3f3] text-font-color hover:bg-[#dbeaea]"
                            }`}
                        >
                            <span>{button.label}</span>
                            {button.icon && (
                                <span className="material-symbols-outlined text-[18px]">
                                    {button.icon}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-[#509595] font-medium">
                        Layout:
                    </span>
                    <button className="p-2 bg-white rounded-lg shadow-sm text-primary">
                        <span className="material-symbols-outlined text-[20px]">
                            grid_view
                        </span>
                    </button>
                    <button className="p-2 bg-transparent text-[#509595] hover:text-font-color">
                        <span className="material-symbols-outlined text-[20px]">
                            view_agenda
                        </span>
                    </button>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((image) => (
                    <ImageCard key={image.id} image={image} />
                ))}

                {/* Empty State / Add Card */}
                <div className="border-2 border-dashed border-[#e8f3f3] rounded-xl flex flex-col items-center justify-center p-8 bg-white/40 group hover:border-primary transition-colors cursor-pointer min-h-100">
                    <div className="w-16 h-16 rounded-full bg-[#e8f3f3] group-hover:bg-primary/20 flex items-center justify-center transition-colors mb-4">
                        <span className="material-symbols-outlined text-[#509595] group-hover:text-primary text-3xl">
                            add
                        </span>
                    </div>
                    <h4 className="font-bold text-font-color">
                        Add masterpiece
                    </h4>
                    <p className="text-[#509595] text-sm text-center mt-2">
                        Create a new folder or upload a batch
                    </p>
                </div>
            </section>

            {/* Pagination */}
            <div className="mt-16 flex justify-center">
                <nav className="flex items-center gap-1 p-1 bg-white rounded-xl shadow-sm border border-[#e8f3f3]">
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#e8f3f3] text-[#509595]">
                        <span className="material-symbols-outlined">
                            chevron_left
                        </span>
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-font-color font-bold">
                        1
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#e8f3f3] text-font-color font-medium">
                        2
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#e8f3f3] text-font-color font-medium">
                        3
                    </button>
                    <div className="px-2 text-[#509595]">...</div>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#e8f3f3] text-font-color font-medium">
                        12
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#e8f3f3] text-[#509595]">
                        <span className="material-symbols-outlined">
                            chevron_right
                        </span>
                    </button>
                </nav>
            </div>
        </main>
    );
}

const images: ImageData[] = [
    {
        id: "1",
        filename: "golden_peak.jpg",
        shortUrl: "vault.io/s/73k2n",
        uploadTime: "2h ago",
        size: "2.4 MB",
        alt: "Vibrant orange sunset over mountains",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAjSh2FwhSF5NKarXr1fyD2Hv37CC1Pj1b6IO4ErTjt0gTudCD_tWaBue31pbymYGOyJJxPSXpkUgtS5cxO0FHVOnjepUDTyvVVj7MzW7jaJHFyqWP03cbFsNb9cOodBr5UIg0b84ompgVA8piUK-Kv2a6WH-b_tuBzj_VTzorOrLpDLXMm1S9IXhWJI1VLgc8yXy5J2EzcJTBqaMky_bMnEkS_8oYEmc9SgXZO1rQK5uSN73GGZT2y3jxMNIM2do_0cZd2DJpw7Ag",
    },
    {
        id: "2",
        filename: "azure_depths.png",
        shortUrl: "vault.io/s/92m1p",
        uploadTime: "5h ago",
        size: "4.1 MB",
        alt: "Deep blue ocean waves aerial view",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB_HL_JAns4eA7kYWsA6QSkrja1QwdGMlqSZRfD6o7CueEIpMIw90qez-SKOYiZTu2y1DQODf8DL-NHrJhQCER9wbTDiUVvV0K812a_8pBezGVLalV-_DR6zuBgSaP_gAhVIVNk9ft8xOO-rQ2Kr3kQ5MWrGQJqOTdcfmwzucaMzDdVQhOzGosVUh5w-JbqcMHceGmfD4m1nXDfeIsBinzd2HyasbiEgopM0sGLQfu5PkZDaqDxt7SzkRefzkCFRsxzbONEtzr_w2Q",
    },
    {
        id: "3",
        filename: "pure_geometry.jpg",
        shortUrl: "vault.io/s/11q4z",
        uploadTime: "Yesterday",
        size: "1.8 MB",
        alt: "Minimalist architectural stairs white",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCYyrvTa7SvQQo0VYw-KlW2MgKy6h2hr7TWFDD-UXlsykG5cg27pCUCnw9_8GGw914zmsD1WwgEN9NzIeol-7AUPpoV4IP7XW0ns0RW-TXiea-3RQOSKIIKzDyyxepVuHUzzjYuEnFewzyAQGFEuBM4_ojGvrK_yuE-a5Yp1AbdLeFehdXSfBXWTpf8QZUkSksLiDg7-jmDhcSZ4SQwLCAnlOkljYoZtBDJNq0C_SD__5RoOJz_7eEYNFALDU52DbbzuPg1BmP0m0M",
    },
    {
        id: "4",
        filename: "silent_wood.png",
        shortUrl: "vault.io/s/55r9t",
        uploadTime: "2d ago",
        size: "3.2 MB",
        alt: "Forest mist morning light",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuC55esd_x_q2051CzK6EqaRKx0MOvNwr165n4tctDoes-6GDEk0ajChzWR89QSCgCiXB2tqfbf8rh6I0bjAbRx8znCwS4pTNxag5XRCyV0LsE5Kop6r428y3EXRSaREfkokdVn8WZfTaJvZEZK97HjL57_3zO4GqKdXfi6RdTAldkX33-eh9p7moHfkHgO2DB367bfT9gVjZvnD331JXp-3Tu1nnKvXk5deSeTmNsAfiV7ghzPZ8v6nWJT3YFFvJL1kbkAcDRXoGHo",
    },
    {
        id: "5",
        filename: "neon_flow.jpg",
        shortUrl: "vault.io/s/88w2v",
        uploadTime: "3d ago",
        size: "5.7 MB",
        alt: "Abstract neon light patterns",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCQLP5k6zONJeEhTd-BoClYWAWRvOaC1jlDE18C2gCOmlzW2YV8kwrVvGavuowX5GIhHdCULsJLdvRx3v5fDb8liRew1t1MonaGZCdm0JW4N5sCylFoRts1ZxJhz7F6u-4kthpkTLYEjwhyL39Zl8Blq39wq_HudNxMPk5_9tmijjc7dbMi6DDuHAMEhZNqfgkwxfa7gA7Hdpgja0au8-rNOpTwjOYeaPPlNkwswI2d-xz2UY4UyvbHB9fGTYE0VlVKwfmjvki2p7w",
    },
    {
        id: "6",
        filename: "urban_night.jpg",
        shortUrl: "vault.io/s/33x1u",
        uploadTime: "4d ago",
        size: "2.9 MB",
        alt: "Cyberpunk city street at night",
        imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBG77Nwn9zzwUVTDlz6yil0fwS8GL58Z7ZEPPLdFKyfkzZ7TAXBR1BCbjj5DVCZwn32A15NuuFMU6MDDK3yq3bnNse2zFdyTm-Bbt-pZ3AVorfnMqUp03SxLdCrO3yqfxqSBFinWrzyChyKXLVMqmL-E9cjdUMKk3hVrziG_ANE0VrXiZk-DiA1Bpc4lsOE6VkNZ5aGjXffcBkP6p_4BODdLbiICeDpceefflyDQwiye8xfUf3Y3jfkjPEzecGgw3MR9Nte8kubZrI",
    },
];

const filterButtons = [
    { label: "Latest", icon: "keyboard_arrow_down", isActive: true },
    { label: "Popular", icon: "trending_up", isActive: false },
    { label: "Architecture", icon: null, isActive: false },
    { label: "Abstract", icon: null, isActive: false },
];
