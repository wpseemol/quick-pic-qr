import Image from "next/image";
import HeroTopLeftInput from "./_components/HeroTopLeftInput";
import { redirect } from "next/navigation";
import { MY_GALLERY_URL } from "@/lib/const-valuse";

export default function HomePage() {
    redirect(MY_GALLERY_URL);

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden mx-auto container">
            <main className="flex-1">
                {/* Hero & Upload Section */}
                <section className="mx-auto px-6 py-12 md:py-20">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                        <div className="flex flex-col gap-6">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-font-color">
                                <span className="material-symbols-outlined text-sm">
                                    qr_code_2
                                </span>
                                Instant QR Generation
                            </div>
                            <h1 className="text-4xl font-black leading-[1.1] tracking-tight md:text-6xl">
                                Upload &amp; Share <br />
                                <span className="text-primary/80">
                                    Images Instantly
                                </span>
                            </h1>
                            <p className="max-w-125 text-lg leading-relaxed text-[#4e6b6b]">
                                The fastest way to get your photos from your
                                desktop to any device. Just drag, drop, and scan
                                to share your moments.
                            </p>
                            <div className="flex items-center gap-4 py-2">
                                <div className="flex -space-x-3">
                                    <div className="relative h-10 w-10 rounded-full border-2 border-white overflow-hidden">
                                        <Image
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrCwURU_993BK3VyquiQirNav-Qr2zfnHnD80zxsYvLpwU4lC3Ja_UH2SwbV_egGo4WAbQDCbpGivzcVan4hMAVQgsQKic4dRSHaPR-Cq0zHFfXGfpKU3CohGxKsJE04nTQApvKIs65MT7QxrZNj8TxgRJ6kCWt5UiVExUupcexzcUUK7LLgmnEDywVfqkNnLnSLvuDpkQGr83Yzn7_eqXXn0v8Yjbi1J0DlM9l8soggptNcGEA-BCK-TR8m70ibx2HmC7eOp_Uj4"
                                            alt="User 1 - Smiling woman"
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                    <div className="relative h-10 w-10 rounded-full border-2 border-white overflow-hidden">
                                        <Image
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRH9avStpZEGCdDFwJYvnZyUyb31Zo8Jp8-fok5tLZecNBNOYYREZhKuYFihV3N028mU0aSaPtcbnY_ZfvdUDB7QW37TxUUCyWA3kkjOdEf6CheNgW764tX15rHJt0VS8J3McYPLbWuj-Q9NHs_QQ49Z4Nx_1VPs0QJ7Mks8qmQTWdA6AwPIcmokhjNI-jyPfTsUiq6ZpVPZKPHmDzZho9Ih31yyj3LKgJzHEs23Kz740JDunhUFw2Nvr32WnJJM7RVXPTWshsRX8"
                                            alt="User 2 - Professional man"
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                    <div className="relative h-10 w-10 rounded-full border-2 border-white overflow-hidden">
                                        <Image
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEjBJXSzgqWlidOFkUgRkcuXvMH3BmFzU3jhRLsJ-9PhPEz6KXoi0zMfHqP72JWRtqlGPTzGySoAhLigY1LCvp7JKEKzd-0YuHn4vWA39D3puBHSTRab85eSy8tOmxwhjpTBOgqu8S_Ou8dtCIQk5_ziZ5WcbNyXVdfSqo7kxsC-mytDgqCHkARxkQ7gqISQoLAytpnJh_x9JL8kecfjd6Huaq1kUZQVET0SpEiIPhXu_NZIk0QR9GVrXbwFAoDYGaZ-MN_5nmKFY"
                                            alt="User 3 - Young person"
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-[#4e6b6b]">
                                    Joined by 2,000+ creators
                                </p>
                            </div>
                        </div>

                        {/* Interactive Upload Area */}
                        {/* <div className="relative">
                            <div className="upload-dashed group relative flex min-h-100 flex-col items-center justify-center bg-white p-8 transition-all hover:bg-primary/5">
                                <div className="flex flex-col items-center gap-6 text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary transition-transform group-hover:scale-110">
                                        <span className="material-symbols-outlined text-4xl">
                                            cloud_upload
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-xl font-bold">
                                            Drag and drop your images here
                                        </p>
                                        <p className="text-sm text-[#4e6b6b]">
                                            Support for JPG, PNG, WEBP (Max
                                            20MB)
                                        </p>
                                    </div>
                                    <button className="mt-4 flex min-w-40 items-center justify-center gap-2 rounded-xl bg-font px-6 py-4 text-white font-bold transition-all hover:bg-[#1a2e2e] shadow-lg">
                                        <span className="material-symbols-outlined">
                                            add_photo_alternate
                                        </span>
                                        Upload Image
                                    </button>
                                </div>
                            </div>
                           
                            <div className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl"></div>
                        </div> */}
                        <HeroTopLeftInput />
                    </div>
                </section>

                {/* Recent Uploads / Gallery Section */}
                <section className="bg-white/50 py-20">
                    <div className="mx-auto px-6">
                        <div className="mb-10 flex items-end justify-between">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-3xl font-bold tracking-tight">
                                    Recent Collection
                                </h2>
                                <p className="text-[#4e6b6b]">
                                    Your latest uploads across all devices
                                </p>
                            </div>
                            <button className="flex items-center gap-2 font-bold text-primary hover:underline">
                                View All{" "}
                                <span className="material-symbols-outlined">
                                    arrow_forward
                                </span>
                            </button>
                        </div>

                        {/* Masonry-like Grid */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Image Card 1 */}
                            <div className="group relative overflow-hidden rounded-xl bg-white neo-shadow transition-all hover:-translate-y-1">
                                <div className="relative aspect-3/4 w-full">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSeiv3wSD-to5j-TcGCtpN2R-tYI-pAUYsMC5ED7IqcYD0MMlvjyaHTMRWUBX-xyIJ6lBNPMVuR_FhPg4HiM695Clwc0ejHQJPZ_7-tEGJ-NQhFFWLBBuSDJeGrtrEd4RziI3DSik3Rbww5srhq-9JGu3I_lxqU4nINr8A8Dy1Se3l6haZH-_9lb3DJYmL6qn7YgMoXdgz3NyRfg0iVAzvKNj3bG3rk_GunYecmau2XQZI_7jcjJzfDPlHBE6-NaYL5G_27GxfeRA"
                                        alt="Dramatic mountain landscape during foggy sunrise"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                </div>
                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-top from-black/80 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-white">
                                            mountain_high.jpg
                                        </p>
                                        <div className="flex gap-2">
                                            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur hover:bg-primary hover:text-black">
                                                <span className="material-symbols-outlined text-sm">
                                                    qr_code
                                                </span>
                                            </button>
                                            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur hover:bg-primary hover:text-black">
                                                <span className="material-symbols-outlined text-sm">
                                                    share
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Image Card 2 */}
                            <div className="group relative overflow-hidden rounded-xl bg-white neo-shadow transition-all hover:-translate-y-1">
                                <div className="relative aspect-3/4 w-full">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHtCEoVfqUFMRbuj61T0VddOoOqeikr8CqIgPTJOB13OnWLLztU-thNtrDMIvyLn2WAvB-diCMZEq0gKyBepnz30tXA0rJMqGvs8dAG-kUJn6OjdAKs576z7-Z5WukMtU8t9d5a18uwvi4dkKtUN_JOrAxkgJt_eLEKlnUrqzTGUv-slPu0dEF6ijeenMXX2WbAV6xWhpB-Diuo7LMnuQUg7Pnwkl8YkbSygRiXHRgZLkMrGvkshavxCl8CxisHV3C0Df0gpScxAk"
                                        alt="Aerial view of turquoise ocean waves and beach"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                </div>
                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-top from-black/80 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-white">
                                            summer_vibes.png
                                        </p>
                                        <div className="flex gap-2">
                                            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur hover:bg-primary hover:text-black">
                                                <span className="material-symbols-outlined text-sm">
                                                    qr_code
                                                </span>
                                            </button>
                                            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur hover:bg-primary hover:text-black">
                                                <span className="material-symbols-outlined text-sm">
                                                    share
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Image Card 3 */}
                            <div className="group relative overflow-hidden rounded-xl bg-white neo-shadow transition-all hover:-translate-y-1">
                                <div className="relative aspect-3/4 w-full">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXL_r8rzIJngew3zqLrRXDSmC-_XBO0sToZ9Xv3dcHgVKnwnqj2NWtiTJkP4w3YXErxqA0xfH5fnzSrQhARjVXwyXT5WvB-SzHoKVwb_bYTr19i2KuJWR19IW8XqjKm0aIczdmUOPe_px1YhIHWzRLOXbs3xqT_ICNxqzBMMhs4f2dKESBRVgYTtlRXyvomz3i67MDj8Aa6yiViQYXXhfSnjcogVVVUSpZoXupX708cvRsrukwnjIVuoQ9LapXd1w-mHLh23XAkIU"
                                        alt="Sunlight filtering through dense green forest trees"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                </div>
                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-top from-black/80 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-white">
                                            nature_deep.jpg
                                        </p>
                                        <div className="flex gap-2">
                                            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur hover:bg-primary hover:text-black">
                                                <span className="material-symbols-outlined text-sm">
                                                    qr_code
                                                </span>
                                            </button>
                                            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur hover:bg-primary hover:text-black">
                                                <span className="material-symbols-outlined text-sm">
                                                    share
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Image Card 4 */}
                            <div className="group relative overflow-hidden rounded-xl bg-white neo-shadow transition-all hover:-translate-y-1">
                                <div className="relative aspect-3/4 w-full">
                                    <Image
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_b6aaRJplBKrbGQRxPqJiO6CGXJVmgtMlDNsEvKJC8_1jl1bOrfQalSqnlMITX8-AHNsUs4bjzJ2DM2RlP5Zc8ffAllSv5Y7ppQWUVbRsaYELSmK_oMoHxYy7YKfBJ9D31fw2lrDG2pVEzI6o2w90LCQAaMq0EMtr3YSUUngzPVyVMfvRLqoXqYEwqhDvevmve2ywXgHDu2gJ4dGTeN8M1fdT-ggQN1fKGWK_dyxqSzgFVLvvHZyfLPaeB0PgPAXkceqXrrRCSAE"
                                        alt="Close up of a neon-lit futuristic city street"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                </div>
                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-top from-black/80 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-white">
                                            cyber_city.webp
                                        </p>
                                        <div className="flex gap-2">
                                            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur hover:bg-primary hover:text-black">
                                                <span className="material-symbols-outlined text-sm">
                                                    qr_code
                                                </span>
                                            </button>
                                            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur hover:bg-primary hover:text-black">
                                                <span className="material-symbols-outlined text-sm">
                                                    share
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sharing Success State Concept (Static Preview) */}
                <section className="mx-auto container px-6 py-20">
                    <div className="flex flex-col items-center gap-12 lg:flex-row">
                        <div className="flex flex-1 flex-col gap-6">
                            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                                Instant Sharing <br />
                                Built for Mobile
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-font-color">
                                        <span className="material-symbols-outlined text-sm font-bold">
                                            check
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">
                                            Zero Latency
                                        </h4>
                                        <p className="text-[#4e6b6b]">
                                            QR codes are generated locally and
                                            instantly after upload.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-font-color">
                                        <span className="material-symbols-outlined text-sm font-bold">
                                            check
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">
                                            Private &amp; Secure
                                        </h4>
                                        <p className="text-[#4e6b6b]">
                                            Control access with password
                                            protection and expiry links.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-font-color">
                                        <span className="material-symbols-outlined text-sm font-bold">
                                            check
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">
                                            Device Agnostic
                                        </h4>
                                        <p className="text-[#4e6b6b]">
                                            No apps required. Just scan with any
                                            native camera app.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex-1 md:max-w-md">
                            <div className="rounded-3xl bg-font-color p-8 text-white shadow-2xl">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-lg font-bold">
                                        Share Preview
                                    </h3>
                                    <span className="material-symbols-outlined text-primary">
                                        verified
                                    </span>
                                </div>
                                <div className="flex flex-col items-center gap-6">
                                    <div className="h-48 w-48 rounded-2xl bg-white p-3 shadow-[0_0_20px_rgba(54,226,226,0.3)]">
                                        <div className="relative h-full w-full">
                                            <Image
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh6KLZXtqAjVPJZUjYpGJu7sHYBAzt6Y3rg57RnUlMsb6ZFHSCNebz4iehG4lC0o0m9KR48Ghq344sXmZa4w3UOSy0TrZJIw9vYpB9JoaAK0IKDYwCcpzFmg4ZpiZ7R4ohEyJfqbU_tkfNV0lcKWg9W0hcRtrjSZOhNcmG03ovWzB6E41vhhCSIbScyaugV4wTNO3hpJPO5NY8x_VzVRzefS81oaQredx2k1UCE8L9x4oH6dYN9MIEnbC-rsfJC_UVutfTxNjGXpE"
                                                alt="Example QR code graphic for sharing"
                                                fill
                                                className="object-contain"
                                                sizes="192px"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full space-y-3">
                                        <p className="text-center text-sm font-medium text-white/60 uppercase tracking-widest">
                                            Shareable Link
                                        </p>
                                        <div className="flex items-center gap-2 rounded-xl bg-white/10 p-3">
                                            <p className="flex-1 truncate text-xs font-mono">
                                                uandshare.io/x/aB34z9kP
                                            </p>
                                            <button className="text-primary hover:text-white transition-colors">
                                                <span className="material-symbols-outlined text-sm">
                                                    content_copy
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
