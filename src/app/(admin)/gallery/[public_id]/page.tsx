import { getCloudinaryImageByPublicId } from "@/action/get-images";
import { decodePath } from "@/utils/encode-decod";
import SimpleQRCode from "./_components/SimpleQRCode";

export default async function SingleImage({
    params,
}: {
    params: Promise<{ public_id: string }>;
}) {
    const publicId = decodePath((await params).public_id);

    const response = await getCloudinaryImageByPublicId(publicId);

    return (
        <div>
            {response.data && response.success ? (
                <SimpleQRCode imageUrl={response.data.secure_url} />
            ) : (
                <>
                    <p>sorry image not found</p>
                </>
            )}
        </div>
    );
}
