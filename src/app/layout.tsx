import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "material-symbols/outlined.css";

import Header from "./_components/Header";
import Footer from "./_components/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    variable: "--font-plus-jakarta",
    display: "swap",
});

export const metadata: Metadata = {
    title: "QuickPicQR – Upload Images & Share with QR Codes",
    description:
        "QuickPicQR lets you upload images, generate QR codes instantly, and share image links easily by scanning the QR code. Fast, simple, and secure image sharing.",
};

export default function RootLayout(
    props: Readonly<{
        children: React.ReactNode;
    }>
) {
    return (
        <html lang="en">
            <body
                className={` ${plusJakartaSans.variable} antialiased bg-background-light dark:bg-background-dark text-font-color`}
            >
                <Header />
                {props.children}
                <Footer />
            </body>
        </html>
    );
}
