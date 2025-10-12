import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const maxFileSize = 20 * 1024 * 1024; // 20MB

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0] || null;
            setSelectedFile(file);
            onFileSelect?.(file);
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } =
        useDropzone({
            onDrop,
            multiple: false,
            accept: { "application/pdf": [".pdf"] },
            maxSize: maxFileSize,
        });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        onFileSelect?.(null);
    };

    return (
        <div className="w-full gradient-border p-4 rounded-2xl">
            <div {...getRootProps()} className="cursor-pointer text-center">
                <input {...getInputProps()} />

                <div className="space-y-4">
                    {selectedFile ? (
                        <div className="flex items-center justify-between bg-gray-50 border rounded-xl p-3 shadow-sm">
                            <div className="flex items-center space-x-3">
                                <img
                                    src="/images/pdf.png"
                                    alt="pdf"
                                    className="w-10 h-10 object-contain"
                                />
                                <div className="text-left">
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatSize(selectedFile.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="p-2 hover:bg-gray-200 rounded-full transition"
                                onClick={handleRemove}
                                aria-label="Remove file"
                            >
                                <img
                                    src="/icons/cross.svg"
                                    alt="remove"
                                    className="w-4 h-4 object-contain"
                                />
                            </button>
                        </div>
                    ) : (
                        <div className="py-6">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img
                                    src="/icons/info.svg"
                                    alt="upload"
                                    className="w-20 h-20 object-contain"
                                />
                            </div>
                            <p className="text-lg text-gray-600">
                                <span className="font-semibold">Click to upload</span> or drag
                                and drop
                            </p>
                            <p className="text-sm text-gray-500">
                                PDF only (max {formatSize(maxFileSize)})
                            </p>
                            {fileRejections.length > 0 && (
                                <p className="text-red-500 mt-2 text-sm">
                                    ⚠️ Invalid file type or size exceeds 20MB.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;
