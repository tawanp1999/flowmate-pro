import React, { useRef, useState, DragEvent } from 'react';

interface UploadAreaProps {
    selectedImages: File[];
    onImagesChange: (files: File[]) => void;
    isImageToPromptMode?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
    selectedImages,
    onImagesChange,
    isImageToPromptMode = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length > 0) {
            onImagesChange([...selectedImages, ...imageFiles]);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files || []);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length > 0) {
            onImagesChange([...selectedImages, ...imageFiles]);
        }
    };

    const handleRemove = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newFiles = selectedImages.filter((_, i) => i !== index);
        onImagesChange(newFiles);
    };

    const handleRemoveAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        onImagesChange([]);
    };

    return (
        <div className="space-y-3">
            {/* Upload Zone */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                    } ${selectedImages.length > 0 ? 'min-h-[100px]' : 'min-h-[140px]'}`}
            >
                {selectedImages.length === 0 ? (
                    <>
                        <svg className="w-10 h-10 text-stone-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-stone-600 text-center font-medium">
                            {isImageToPromptMode ? 'อัปโหลดรูปที่ต้องการแกะสูตร' : 'ลากรูปมาวางที่นี่'}
                        </p>
                        <p className="text-xs text-stone-500 mt-1">
                            {isImageToPromptMode ? '(อัปโหลดได้ทีละรูป)' : 'อัปโหลดได้หลายรูป'}
                        </p>
                        <p className="text-xs text-stone-400 mt-2">
                            รองรับ JPEG, PNG, WebP
                        </p>
                    </>
                ) : (
                    <div className="w-full text-center flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="text-sm text-stone-700 font-medium">
                            คลิกเพื่อเพิ่มรูปภาพ ({selectedImages.length} รูป)
                        </p>
                    </div>
                )}
            </div>

            {/* Preview Grid */}
            {selectedImages.length > 0 && (
                <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-600">
                            รูปที่เลือก ({selectedImages.length})
                        </span>
                        <button
                            onClick={handleRemoveAll}
                            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            ลบทั้งหมด
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {selectedImages.map((file, index) => {
                            const preview = URL.createObjectURL(file);
                            return (
                                <div key={index} className="relative rounded-lg overflow-hidden border border-stone-200 bg-white group">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover"
                                        onLoad={() => URL.revokeObjectURL(preview)}
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Index Badge */}
                                    <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {index + 1}
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => handleRemove(index, e)}
                                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                                        title="ลบรูปนี้"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    {/* Filename */}
                                    <div className="absolute bottom-0 left-0 right-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-[9px] text-white truncate">
                                            {file.name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Hidden Input - Allow Multiple */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                multiple={!isImageToPromptMode}
            />
        </div>
    );
};
