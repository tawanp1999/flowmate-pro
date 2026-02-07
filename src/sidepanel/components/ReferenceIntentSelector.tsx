import React from 'react';
import { INTENT_OPTIONS } from '../constants';

interface ReferenceIntentSelectorProps {
    selectedIntents: string[];
    onToggleIntent: (intentId: string) => void;
    isCustomMode: boolean;
}

export const ReferenceIntentSelector: React.FC<ReferenceIntentSelectorProps> = ({
    selectedIntents,
    onToggleIntent,
    isCustomMode
}) => {
    return (
        <div className="mt-4 animate-fade-in p-4 bg-stone-50 border border-stone-200 rounded-xl">
            <label className="block text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                ต้องการให้อ้างอิงส่วนไหนจากภาพ? <span className="text-stone-400 font-normal text-xs ml-1">(เลือกได้หลายข้อ)</span>
            </label>

            <div className="space-y-4">
                {INTENT_OPTIONS.map((group, gIndex) => (
                    <div key={gIndex}>
                        <h4 className="text-[10px] uppercase font-bold text-stone-400 mb-1.5 tracking-wider">
                            {group.label}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {group.options.map((option) => {
                                const isSelected = selectedIntents.includes(option.id);
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => onToggleIntent(option.id)}
                                        className={`text-xs py-1.5 px-3 rounded-full border transition-all flex items-center gap-1.5 active:scale-95 ${isSelected
                                            ? 'bg-slate-700 border-slate-700 text-white shadow-md'
                                            : 'bg-white border-stone-300 text-stone-600 hover:border-slate-400 hover:text-slate-700 hover:bg-stone-50'
                                            }`}
                                    >
                                        {isSelected && (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {isCustomMode && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-2">
                    <span className="text-amber-500 text-lg">💡</span>
                    <p className="text-xs text-amber-800 italic leading-relaxed">
                        ในโหมดเนรมิต AI จะฉลาดพอที่จะดึงองค์ประกอบตามที่คุณพิมพ์สั่ง เช่น "หน้าเหมือนรูปที่ 1 แต่ชุดเหมือนรูปที่ 2"
                    </p>
                </div>
            )}
        </div>
    );
};

