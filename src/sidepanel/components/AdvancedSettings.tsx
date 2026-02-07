import React from 'react';
import { ASPECT_RATIOS, STYLE_OPTIONS, THAI_FONTS } from '../constants';

interface AdvancedSettingsProps {
    isExpanded: boolean;
    onToggle: () => void;

    // Task Type Flags
    isImageToPrompt: boolean;

    // Values
    userAspectRatio: string;
    userResolution: string;
    style: string;
    fontName: string;
    textInImage: string;
    negativePrompt: string;
    additionalDetails: string;

    // Change Handlers
    onAspectRatioChange: (ratio: string) => void;
    onResolutionChange: (res: string) => void;
    onStyleChange: (style: string) => void;
    onFontChange: (font: string) => void;
    onTextInImageChange: (text: string) => void;
    onNegativePromptChange: (text: string) => void;
    onAdditionalDetailsChange: (text: string) => void;

    // Brand Kit
    brandKitEnabled: boolean;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
    isExpanded,
    onToggle,
    isImageToPrompt,
    userAspectRatio,
    userResolution,
    style,
    fontName,
    textInImage,
    negativePrompt,
    additionalDetails,
    onAspectRatioChange,
    onResolutionChange,
    onStyleChange,
    onFontChange,
    onTextInImageChange,
    onNegativePromptChange,
    onAdditionalDetailsChange,
    brandKitEnabled
}) => {
    return (
        <div className="pt-2">
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-amber-600 transition-colors w-full p-2 rounded-lg hover:bg-stone-100"
            >
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                ⚙️ การตั้งค่าขั้นสูง (Advanced Settings)
            </button>

            {/* Collapsible Content */}
            {isExpanded && (
                <div className="mt-4 space-y-6 p-5 bg-white rounded-xl border border-stone-200 animate-fade-in shadow-sm">

                    {/* Technical Specs Group */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-stone-600 uppercase tracking-wide">สเปคภาพ (Specs)</h3>

                        {/* Aspect Ratio Visualizer */}
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">สัดส่วนภาพ (Aspect Ratio)</label>
                            <div className="grid grid-cols-3 gap-2">
                                {ASPECT_RATIOS.map((ratio) => {
                                    const isSelected = userAspectRatio === ratio.id;
                                    return (
                                        <button
                                            key={ratio.id}
                                            onClick={() => onAspectRatioChange(ratio.id)}
                                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all active:scale-95 ${isSelected
                                                ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-md ring-1 ring-amber-500'
                                                : 'bg-white border-stone-300 text-stone-600 hover:border-amber-400'
                                                }`}
                                            title={ratio.desc}
                                        >
                                            <div
                                                className={`border-2 mb-1.5 transition-colors ${isSelected ? 'border-amber-500 bg-amber-100' : 'border-stone-400 bg-stone-100'}`}
                                                style={{ width: `${ratio.w}px`, height: `${ratio.h}px` }}
                                            />
                                            <span className="text-xs font-bold">{ratio.label}</span>
                                            <span className="text-[10px] text-stone-500 mt-0.5">{ratio.desc}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Resolution */}
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1">ความละเอียด</label>
                            <select
                                value={userResolution}
                                onChange={(e) => onResolutionChange(e.target.value)}
                                className="w-full p-2 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            >
                                <option value="1K">1K (มาตรฐาน)</option>
                                <option value="2K">2K (คมชัดสูง)</option>
                                <option value="4K">4K (Ultra HD)</option>
                            </select>
                        </div>
                    </div>

                    {/* Only show extra options if NOT image-to-prompt */}
                    {!isImageToPrompt && (
                        <div className="border-t border-stone-200 pt-3 space-y-4">
                            {/* Style Visual Selector */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-2">สไตล์ภาพ (Style)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {STYLE_OPTIONS.map((option) => {
                                        const isSelected = style === option.id;
                                        const isCyberpunk = option.id === 'Cyberpunk';
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => onStyleChange(option.id)}
                                                className={`relative overflow-hidden p-2.5 rounded-lg border text-left transition-all active:scale-95 ${isSelected
                                                    ? 'ring-2 ring-amber-500 shadow-md transform scale-[1.02]'
                                                    : 'hover:shadow hover:border-stone-400 opacity-90 hover:opacity-100'
                                                    } ${option.color}`}
                                            >
                                                <div className="flex flex-col h-full justify-between relative z-10">
                                                    <span className={`text-base font-bold truncate ${isCyberpunk ? 'text-white' : 'text-slate-800'}`}>{option.label}</span>
                                                    <span className={`text-xs truncate ${isCyberpunk ? 'text-slate-300' : 'text-slate-600'}`}>{option.sub}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Font Name (10 fonts) */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1">ฟอนต์ (Font Name)</label>
                                <select
                                    value={fontName}
                                    onChange={(e) => onFontChange(e.target.value)}
                                    disabled={brandKitEnabled}
                                    className={`w-full p-2.5 rounded-lg border border-stone-300 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white text-stone-800 ${brandKitEnabled ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {THAI_FONTS.map(font => (
                                        <option key={font.value} value={font.value}>{font.label}</option>
                                    ))}
                                </select>
                                {brandKitEnabled && (
                                    <p className="text-sm text-stone-500 mt-1">ปิดใช้งานเพราะ Brand Kit เปิดอยู่</p>
                                )}
                            </div>

                            {/* Text in Image */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1">ข้อความในภาพ (Text in Image)</label>
                                <input
                                    type="text"
                                    value={textInImage}
                                    onChange={(e) => onTextInImageChange(e.target.value)}
                                    placeholder='บังคับข้อความ เช่น "SALE 50%" (ถ้าว่าง AI คิดให้)'
                                    className="w-full p-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder-stone-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm"
                                />
                            </div>

                            {/* Negative Prompt */}
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1">ห้ามมี (Negative Prompt)</label>
                                <textarea
                                    value={negativePrompt}
                                    onChange={(e) => onNegativePromptChange(e.target.value)}
                                    placeholder="คน, สัตว์, สีแดง, ภาพเบลอ..."
                                    className="w-full h-16 p-3 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder-stone-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Additional Details - Show in all modes */}
                    <div className={!isImageToPrompt ? "" : "border-t border-stone-200 pt-3"}>
                        <label className="block text-sm font-bold text-stone-700 mb-1">
                            รายละเอียดเพิ่มเติม {isImageToPrompt && "(Optional Context)"}
                        </label>
                        <textarea
                            value={additionalDetails}
                            onChange={(e) => onAdditionalDetailsChange(e.target.value)}
                            placeholder={isImageToPrompt ? 'ใส่บริบทเพิ่มเติมถ้าต้องการ เช่น "เปลี่ยนเป็นโทนสีเขียว" (ถ้าไม่ใส่จะยึดตามภาพ)' : "เช่น อยากได้โทนสีเขียวธรรมชาติ..."}
                            className="w-full h-16 p-3 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder-stone-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm resize-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
