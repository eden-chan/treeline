export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-64 h-64 relative">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/planting-tree.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <p className="mt-4 text-white text-xl font-semibold animate-pulse">
                Planting Trees...
            </p>
        </div>
    );
}