import React from 'react';
import { BrandKit } from '../../types';

interface BrandKitModalProps {
    isOpen: boolean;
    brandKit: BrandKit;
    onClose: () => void;
    onUpdate: (brandKit: BrandKit) => void;
}

export const BrandKitModal: React.FC<BrandKitModalProps> = ({ isOpen, brandKit, onClose, onUpdate }) => {
    const [localBrandKit, setLocalBrandKit] = React.useState<BrandKit>(brandKit);

    React.useEffect(() => {
        setLocalBrandKit(brandKit);
    }, [brandKit]);

    if (!isOpen) return null;

    const handleSave = () => {
        onUpdate(localBrandKit);
        onClose();
    };

    const updateField = (field: keyof BrandKit, value: string | boolean) => {
        setLocalBrandKit(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in">
            <div className="glass bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border border-stone-200">
                {/* Header */}
                <div className="px-6 py-4 bg-slate-800 flex justify-between items-center shadow-md">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        ตั้งค่า Brand Kit
                    </h3>
                    <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Enable/Disable Toggle - PROMINENT */}
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${localBrandKit.enabled ? 'bg-amber-500' : 'bg-stone-300'}`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-stone-800">เปิดใช้งาน Brand Kit</h4>
                                    <p className="text-xs text-stone-600">ใช้ข้อมูลแบรนด์ในทุก Prompt ที่สร้าง</p>
                                </div>
                            </div>
                            <button
                                onClick={() => updateField('enabled', !localBrandKit.enabled)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${localBrandKit.enabled ? 'bg-amber-500' : 'bg-stone-300'}`}
                            >
                                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${localBrandKit.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Input Fields - grayed out if disabled */}
                    <div className={`space-y-4 ${!localBrandKit.enabled && 'opacity-50 pointer-events-none'}`}>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">ชื่อแบรนด์ (Brand Name)</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-stone-800 placeholder-stone-400"
                                placeholder="Ex. Banana Cafe"
                                value={localBrandKit.brandName}
                                onChange={(e) => updateField('brandName', e.target.value)}
                                disabled={!localBrandKit.enabled}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">สีประจำแบรนด์ (Brand Colors)</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-stone-800 placeholder-stone-400"
                                placeholder="Ex. Yellow #FFD452 and Dark Grey"
                                value={localBrandKit.brandColor}
                                onChange={(e) => updateField('brandColor', e.target.value)}
                                disabled={!localBrandKit.enabled}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">ฟอนต์ (Brand Font)</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-stone-800 placeholder-stone-400"
                                placeholder="Ex. Kanit Medium"
                                value={localBrandKit.brandFont}
                                onChange={(e) => updateField('brandFont', e.target.value)}
                                disabled={!localBrandKit.enabled}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">อารมณ์/บุคลิก (Mood/Tone)</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-stone-800 placeholder-stone-400"
                                placeholder="Ex. Friendly, Modern, Energetic"
                                value={localBrandKit.brandMood}
                                onChange={(e) => updateField('brandMood', e.target.value)}
                                disabled={!localBrandKit.enabled}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">ข้อมูลเพิ่มเติม (Context)</label>
                            <textarea
                                className="w-full p-2.5 border border-stone-300 rounded-lg h-24 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-stone-800 resize-none placeholder-stone-400"
                                placeholder="Ex. เป็นร้านกาแฟสำหรับคนรุ่นใหม่ เน้นถ่ายรูปสวย..."
                                value={localBrandKit.additionalContext}
                                onChange={(e) => updateField('additionalContext', e.target.value)}
                                disabled={!localBrandKit.enabled}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 btn-gradient text-amber-900 rounded-lg font-bold shadow-lg transform active:scale-95 transition-all"
                    >
                        บันทึกและปิด
                    </button>
                </div>
            </div>
        </div>
    );
};
