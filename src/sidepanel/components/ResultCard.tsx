import React, { useState } from 'react';
import { PromptResult } from '../../types';

interface ResultCardProps {
    result: PromptResult;
    onAutoFill: (text: string) => void;
    onRefine?: (refinementInstruction: string) => void;
    showToast: (message: string, type: 'success' | 'error') => void;
    isRefining?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
    result,
    onAutoFill,
    onRefine,
    showToast,
    isRefining = false
}) => {
    const [expanded, setExpanded] = useState<'thai' | 'english' | 'reasoning' | null>('thai');
    const [showRefineInput, setShowRefineInput] = useState(false);
    const [refinementText, setRefinementText] = useState('');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('คัดลอกเรียบร้อย!', 'success');
    };

    // Format bold markdown
    const formatText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <span key={index} className="font-semibold text-amber-700">
                        {part.slice(2, -2)}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    const handleRefine = () => {
        if (!refinementText.trim()) {
            showToast('กรุณาใส่คำสั่งในการแก้ไข', 'error');
            return;
        }
        if (onRefine) {
            onRefine(refinementText);
            setRefinementText('');
            setShowRefineInput(false);
        }
    };

    return (
        <div className="space-y-3 animate-fade-in">
            {/* Main Prompt Card */}
            <div className="glass rounded-xl overflow-hidden">
                <button
                    onClick={() => setExpanded(expanded === 'thai' ? null : 'thai')}
                    className="w-full px-4 py-4 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors border-b border-amber-100"
                >
                    <span className="font-bold text-amber-800 flex items-center gap-2">
                        <span className="text-xl">✨</span>
                        Prompt ภาษาไทย
                    </span>
                    <svg
                        className={`w-5 h-5 text-amber-600 transition-transform ${expanded === 'thai' ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {expanded === 'thai' && (
                    <div className="p-4 border-t border-stone-200 bg-white">
                        <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
                            {formatText(result.thaiPrompt)}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => copyToClipboard(result.thaiPrompt)}
                                className="flex-1 py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                คัดลอก
                            </button>
                            <button
                                onClick={() => onAutoFill(result.thaiPrompt)}
                                className="flex-1 py-2 px-3 rounded-lg btn-gradient text-amber-900 text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <span>✨</span>
                                กรอกอัตโนมัติ
                            </button>
                        </div>

                        {/* Refine Button */}
                        {onRefine && (
                            <button
                                onClick={() => setShowRefineInput(!showRefineInput)}
                                className="w-full mt-2 py-2 px-3 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                แก้ไข Prompt (Refine)
                            </button>
                        )}

                        {/* Refine Input */}
                        {showRefineInput && (
                            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg animate-fade-in">
                                <label className="block text-xs font-semibold text-purple-700 mb-2">
                                    บอก AI ว่าต้องการแก้ไขอย่างไร:
                                </label>
                                <textarea
                                    value={refinementText}
                                    onChange={(e) => setRefinementText(e.target.value)}
                                    placeholder="เช่น: เพิ่มบรรยากาศน่ากลัวขึ้น, เปลี่ยนสีเป็นโทนเย็น, ทำให้น่าสนใจกว่านี้"
                                    className="w-full h-20 p-2 rounded-lg border border-purple-300 bg-white text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-none"
                                    disabled={isRefining}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={handleRefine}
                                        disabled={isRefining}
                                        className="flex-1 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {isRefining ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                กำลังแก้ไข...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                แก้ไข Prompt
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowRefineInput(false)}
                                        className="py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium transition-colors"
                                    >
                                        ยกเลิก
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>



            {/* Reasoning */}
            <div className="glass rounded-xl overflow-hidden">
                <button
                    onClick={() => setExpanded(expanded === 'reasoning' ? null : 'reasoning')}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                >
                    <span className="font-medium text-stone-600 flex items-center gap-2">
                        <span>💡</span>
                        ทำไม Prompt นี้ถึงเวิร์ค?
                    </span>
                    <svg
                        className={`w-5 h-5 text-stone-500 transition-transform ${expanded === 'reasoning' ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {expanded === 'reasoning' && (
                    <div className="p-4 border-t border-stone-200 bg-white">
                        <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                            {formatText(result.reasoning)}
                        </p>
                    </div>
                )}
            </div>

            {/* Tech Specs */}
            <div className="glass rounded-xl p-4">
                <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                    สเปคที่แนะนำ
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-stone-100 rounded-lg p-3">
                        <p className="text-xs text-stone-500">Aspect Ratio</p>
                        <p className="text-sm font-semibold text-stone-800">{result.suggestedParameters.aspectRatio}</p>
                    </div>
                    <div className="bg-stone-100 rounded-lg p-3">
                        <p className="text-xs text-stone-500">Style</p>
                        <p className="text-sm font-semibold text-stone-800">{result.suggestedParameters.style}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
