export default async function ShowImagePage({
    params,
}: {
    params: Promise<{ public_id: string }>;
}) {
    const publicId = (await params).public_id;

    return (
        <div className="text-center mt-14">
            show Image by public id: {publicId}
        </div>
    );
}
