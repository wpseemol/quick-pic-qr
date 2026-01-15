import { getCloudinaryImagesByPage } from "@/action/get-images";
import HeroUploadArea from "./_components/HeroUploadArea";
import ImageCard from "./_components/ImageCard";

export default async function GalleryPage() {
    const response = await getCloudinaryImagesByPage();

    return (
        <main className="container mx-auto px-6 lg:px-20 py-8">
            {/* Hero Section / Upload Area */}
            <HeroUploadArea />

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
                {response.success &&
                response.data &&
                response.data.images.length > 0 ? (
                    response.data.images.map((image) => (
                        <ImageCard key={image.public_id} image={image} />
                    ))
                ) : (
                    <>
                        <p className="text-center mt-6">image not found</p>
                    </>
                )}

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

const filterButtons = [
    { label: "Latest", icon: "keyboard_arrow_down", isActive: true },
    { label: "Popular", icon: "trending_up", isActive: false },
    { label: "Architecture", icon: null, isActive: false },
    { label: "Abstract", icon: null, isActive: false },
];
