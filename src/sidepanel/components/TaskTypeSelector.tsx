import React from 'react';
import { TaskType } from '../../types';
import { TASK_DESCRIPTIONS } from '../constants';

interface TaskTypeSelectorProps {
    selectedType: TaskType;
    onSelectType: (type: TaskType) => void;
}

export const TaskTypeSelector: React.FC<TaskTypeSelectorProps> = ({ selectedType, onSelectType }) => {
    const isImageToPrompt = selectedType === 'image-to-prompt';
    const isCustom = selectedType === 'custom';

    return (
        <div className="glass rounded-xl overflow-hidden shadow-md">
            <div className="px-4 py-4 border-b border-stone-100 bg-white">
                <h2 className="text-lg font-bold text-stone-800 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white text-base font-bold shadow-sm">1</span>
                    เลือกโหมดการทำงาน
                </h2>
            </div>

            <div className="p-4 grid grid-cols-3 gap-2">
                {/* Cover */}
                <button
                    onClick={() => onSelectType('cover')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200 active:scale-95 ${selectedType === 'cover'
                        ? 'bg-white border-amber-400 text-amber-700 shadow-sm'
                        : 'bg-white border-stone-200 text-stone-500 hover:border-amber-200 hover:text-amber-600'
                        }`}
                >
                    <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-bold">ภาพปก</span>
                </button>

                {/* Infographic */}
                <button
                    onClick={() => onSelectType('infographic')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200 active:scale-95 ${selectedType === 'infographic'
                        ? 'bg-white border-amber-400 text-amber-700 shadow-sm'
                        : 'bg-white border-stone-200 text-stone-500 hover:border-amber-200 hover:text-amber-600'
                        }`}
                >
                    <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-xs font-bold">Infographic</span>
                </button>

                {/* Illustration */}
                <button
                    onClick={() => onSelectType('illustration')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200 active:scale-95 ${selectedType === 'illustration'
                        ? 'bg-white border-amber-400 text-amber-700 shadow-sm'
                        : 'bg-white border-stone-200 text-stone-500 hover:border-amber-200 hover:text-amber-600'
                        }`}
                >
                    <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-xs font-bold">ภาพประกอบ</span>
                </button>

                {/* Custom */}
                <button
                    onClick={() => onSelectType('custom')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200 active:scale-95 ${selectedType === 'custom'
                        ? 'bg-white border-orange-400 text-orange-600 shadow-sm'
                        : 'bg-white border-stone-200 text-stone-500 hover:border-orange-200 hover:text-orange-600'
                        }`}
                >
                    <svg className="w-4 h-4 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span className="text-xs font-bold">โหมดเนรมิต</span>
                </button>

                {/* Image-to-Prompt (spans 2 columns) */}
                <button
                    onClick={() => onSelectType('image-to-prompt')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-200 relative overflow-hidden group active:scale-95 col-span-2 ${selectedType === 'image-to-prompt'
                        ? 'bg-white border-purple-400 text-purple-600 shadow-sm'
                        : 'bg-white border-stone-200 text-stone-500 hover:border-purple-200 hover:text-purple-600'
                        }`}
                >
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-500 to-purple-600 text-white text-[8px] px-1.5 py-0.5 rounded-bl font-bold">REVERSE</div>
                    <div className="flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-xs font-bold">แกะสูตรจากภาพ (Reverse)</span>
                    </div>
                </button>
            </div>

            {/* Description */}
            <div className="px-4 pb-4">
                <div className={`text-xs p-3 rounded-lg border flex gap-2 items-start ${isImageToPrompt
                    ? 'bg-purple-50 text-purple-800 border-purple-300'
                    : isCustom
                        ? 'bg-orange-50 text-orange-800 border-orange-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                    <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isImageToPrompt ? 'text-purple-600' : isCustom ? 'text-orange-600' : 'text-amber-600'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="leading-relaxed font-medium">{TASK_DESCRIPTIONS[selectedType]}</p>
                </div>
            </div>
        </div>
    );
};
