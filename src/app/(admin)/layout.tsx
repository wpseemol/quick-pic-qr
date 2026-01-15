import { redirect } from "next/navigation";
import Footer from "./_components/Footer";
import Header from "./_components/Header";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    redirect("/login");

    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
