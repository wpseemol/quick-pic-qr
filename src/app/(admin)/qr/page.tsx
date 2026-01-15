import { Metadata } from "next";
import SimpleQRCode from "./_components/SimpleQRCode";
import { getCloudinaryImageByPublicId } from "@/action/get-images";
import NotFoundComponent from "./_components/NotFoundComponent";
import { decodePath } from "@/utils/encode-decod";

export default async function QrPage({
    searchParams,
}: {
    searchParams: Promise<{ id: string }>;
}) {
    // AWAIT the searchParams in Server Components
    const params = await searchParams;
    const { id } = params;

    if (!id) {
        return <NotFoundComponent />;
    }

    const response = await getCloudinaryImageByPublicId(decodePath(id));

    return response.data && response.success ? (
        <div>
            <SimpleQRCode imageUrl={response.data.secure_url} />
        </div>
    ) : (
        <NotFoundComponent />
    );
}

// Dynamic metadata based on search params
export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ id: string }>;
}): Promise<Metadata> {
    const params = await searchParams;
    const { id } = params;

    return {
        title: `QR Show | image id:${id}`,
        description: `QR code for image id ${id} `,
        // Add other metadata as needed
        openGraph: {
            title: `QR Code for ${id}`,
            description: `View the QR code for image id ${id}`,
        },
    };
}
