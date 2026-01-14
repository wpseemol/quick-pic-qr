"use client";

import { useState, useRef } from "react";
import { Download, Settings, RefreshCw, Check } from "lucide-react";
import QRCode from "react-qr-code";

interface SimpleQRCodeProps {
    imageUrl: string;
    fileName?: string;
}

export default function SimpleQRCode({
    imageUrl,
    fileName,
}: SimpleQRCodeProps) {
    const [downloading, setDownloading] = useState(false);
    const [qrSize, setQrSize] = useState<number>(300); // Larger default size
    const [qrColor, setQrColor] = useState<string>("#000000");
    const [bgColor, setBgColor] = useState<string>("#FFFFFF");
    const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("H"); // Highest error correction
    const [showSettings, setShowSettings] = useState(false);
    const [copied, setCopied] = useState(false);

    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownloadQR = async () => {
        if (!qrRef.current) return;

        try {
            setDownloading(true);

            const svg = qrRef.current.querySelector("svg");
            if (!svg) {
                throw new Error("QR code SVG not found");
            }

            // Create a high-resolution canvas (scale up for better quality)
            const scale = 4; // 4x resolution for crisp output
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();

            const svgBlob = new Blob([svgData], {
                type: "image/svg+xml;charset=utf-8",
            });
            const url = URL.createObjectURL(svgBlob);

            await new Promise((resolve, reject) => {
                img.onload = () => {
                    try {
                        // Set canvas to higher resolution
                        canvas.width = img.width * scale;
                        canvas.height = img.height * scale;

                        if (ctx) {
                            // Fill with background color
                            ctx.fillStyle = bgColor;
                            ctx.fillRect(0, 0, canvas.width, canvas.height);

                            // Scale up the image
                            ctx.imageSmoothingEnabled = false; // Crisp scaling
                            ctx.scale(scale, scale);
                            ctx.drawImage(img, 0, 0);

                            // Reset scale
                            ctx.setTransform(1, 0, 0, 1, 0, 0);

                            // Add border and branding for better appearance
                            ctx.strokeStyle = "#E5E7EB";
                            ctx.lineWidth = 2;
                            ctx.strokeRect(0, 0, canvas.width, canvas.height);

                            // Optional: Add subtle branding text
                            ctx.fillStyle = "#6B7280";
                            ctx.font = "bold 24px Arial";
                            ctx.textAlign = "center";
                            ctx.fillText("QR Code", canvas.width / 2, 40);

                            ctx.font = "14px Arial";
                            ctx.fillText(
                                "Scan with camera",
                                canvas.width / 2,
                                canvas.height - 20
                            );

                            // Create download
                            const pngUrl = canvas.toDataURL("image/png", 1.0); // Highest quality
                            const downloadLink = document.createElement("a");
                            downloadLink.href = pngUrl;
                            downloadLink.download = `qr-high-quality-${
                                fileName || "image"
                            }.png`;
                            document.body.appendChild(downloadLink);
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                        }
                        URL.revokeObjectURL(url);
                        resolve(true);
                    } catch (error) {
                        reject(error);
                    }
                };

                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    reject(new Error("Failed to load QR image"));
                };

                img.src = url;
            });
        } catch (err) {
            console.error("QR download failed:", err);
        } finally {
            setDownloading(false);
        }
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(imageUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy URL:", err);
        }
    };

    const handleResetSettings = () => {
        setQrSize(300);
        setQrColor("#000000");
        setBgColor("#FFFFFF");
        setErrorLevel("H");
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            High-Quality QR Code
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {fileName ||
                                "Generate and download high-resolution QR code"}
                        </p>
                    </div>

                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Settings size={20} />
                        {showSettings ? "Hide Settings" : "Customize QR"}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - QR Display */}
                    <div className="lg:w-2/3">
                        <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                            <div className="relative mb-6">
                                <div
                                    className="bg-white p-6 rounded-lg shadow-xl"
                                    ref={qrRef}
                                >
                                    <QRCode
                                        value={imageUrl}
                                        size={qrSize}
                                        bgColor={bgColor}
                                        fgColor={qrColor}
                                        level={errorLevel}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            maxWidth: "500px",
                                        }}
                                    />
                                </div>

                                {/* Quality Badge */}
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    HD Quality
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Ready to Scan
                                </h3>
                                <p className="text-gray-600 max-w-md">
                                    This high-resolution QR code contains your
                                    image URL. Test it with your camera app to
                                    ensure it scans perfectly.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Controls */}
                    <div className="lg:w-1/3 space-y-6">
                        {/* Settings Panel */}
                        {showSettings && (
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-800">
                                        QR Customization
                                    </h3>
                                    <button
                                        onClick={handleResetSettings}
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <RefreshCw size={14} />
                                        Reset
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Size Control */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            QR Size: {qrSize}px
                                        </label>
                                        <input
                                            type="range"
                                            min="200"
                                            max="500"
                                            step="10"
                                            value={qrSize}
                                            onChange={(e) =>
                                                setQrSize(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>Small</span>
                                            <span>Large</span>
                                        </div>
                                    </div>

                                    {/* Color Controls */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                QR Color
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={qrColor}
                                                    onChange={(e) =>
                                                        setQrColor(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-10 h-10 cursor-pointer rounded border border-gray-300"
                                                />
                                                <span className="text-sm font-mono">
                                                    {qrColor}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Background
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={bgColor}
                                                    onChange={(e) =>
                                                        setBgColor(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-10 h-10 cursor-pointer rounded border border-gray-300"
                                                />
                                                <span className="text-sm font-mono">
                                                    {bgColor}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error Correction */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Error Correction
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {(
                                                ["L", "M", "Q", "H"] as const
                                            ).map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() =>
                                                        setErrorLevel(level)
                                                    }
                                                    className={`py-2 text-sm font-medium rounded-lg transition-colors ${
                                                        errorLevel === level
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    }`}
                                                >
                                                    {level}
                                                    <div className="text-xs opacity-75">
                                                        {level === "L"
                                                            ? "7%"
                                                            : level === "M"
                                                            ? "15%"
                                                            : level === "Q"
                                                            ? "25%"
                                                            : "30%"}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Higher levels allow more damage
                                            recovery
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-4">
                            <button
                                onClick={handleDownloadQR}
                                disabled={downloading}
                                className="w-full py-4 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold flex items-center justify-center gap-3 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                            >
                                {downloading ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Generating HD QR...
                                    </>
                                ) : (
                                    <>
                                        <Download size={24} />
                                        Download HD QR Code
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleCopyUrl}
                                disabled={copied}
                                className="w-full py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check size={20} />
                                        URL Copied!
                                    </>
                                ) : (
                                    <>
                                        <span>📋</span>
                                        Copy Image URL
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Preview Info */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                            <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                <span>ℹ️</span>
                                Quality Features
                            </h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li className="flex items-center gap-2">
                                    <Check size={14} />
                                    4x resolution scaling for crisp output
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} />
                                    Highest error correction (30%)
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} />
                                    Lossless PNG format
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} />
                                    Customizable colors and sizes
                                </li>
                            </ul>
                        </div>

                        {/* URL Info */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h4 className="font-medium text-gray-700 mb-2">
                                URL in QR Code
                            </h4>
                            <div className="bg-white p-3 rounded-lg border border-gray-300">
                                <code className="text-xs text-gray-800 break-all font-mono">
                                    {imageUrl}
                                </code>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                This exact URL is encoded in the QR code
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quality Tips */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-3">
                        Tips for Best Quality
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-blue-600 font-bold mb-2">
                                1. Size Matters
                            </div>
                            <p className="text-sm text-gray-600">
                                Larger QR codes (400px+) scan better from
                                distance and work better when printed.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-blue-600 font-bold mb-2">
                                2. Error Correction
                            </div>
                            <p className="text-sm text-gray-600">
                                Use &quot;H&quot; (30%) level for maximum
                                reliability, especially for printed materials.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-blue-600 font-bold mb-2">
                                3. Contrast
                            </div>
                            <p className="text-sm text-gray-600">
                                Ensure high contrast between QR color and
                                background for optimal scanning.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
