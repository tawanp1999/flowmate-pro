import React, { useState, useEffect, useRef } from 'react';
import { TaskTypeSelector } from './components/TaskTypeSelector';
import { UploadArea } from './components/UploadArea';
import { ReferenceIntentSelector } from './components/ReferenceIntentSelector';
import { AdvancedSettings } from './components/AdvancedSettings';
import { ResultCard } from './components/ResultCard';
import { Settings } from './components/Settings';
import { BrandKitModal } from './components/BrandKitModal';
import { HistorySidebar } from './components/HistorySidebar';
import { generateNanoPrompt, refineNanoPrompt } from '../services/geminiService';
import { TaskType, BrandKit, HistoryItem, PromptResult } from '../types';
import { LOADING_MESSAGES } from './constants';

const DEFAULT_BRAND_KIT: BrandKit = {
    enabled: false,
    brandName: '',
    brandColor: '',
    brandFont: '',
    brandMood: '',
    additionalContext: ''
};

const App: React.FC = () => {
    // API Key Check
    const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

    // Task Configuration
    const [taskType, setTaskType] = useState<TaskType>('image-to-prompt');
    const [contentInput, setContentInput] = useState('');

    // Advanced Settings
    const [advancedExpanded, setAdvancedExpanded] = useState(false);
    const [userAspectRatio, setUserAspectRatio] = useState('16:9');
    const [userResolution, setUserResolution] = useState('2K');
    const [style, setStyle] = useState('Auto');
    const [fontName, setFontName] = useState('Auto');
    const [textInImage, setTextInImage] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('หน้าคน');
    const [additionalDetails, setAdditionalDetails] = useState('บรรยากาศ, แสงแดด, และสภาพแวดล้อม ต้องให้ความรู้สึกว่าเป็นประเทศไทย (Thailand Vibe)');

    // Reference Images
    const [referenceImages, setReferenceImages] = useState<File[]>([]);
    const [referenceIntents, setReferenceIntents] = useState<string[]>([]);

    // Brand Kit
    const [brandKit, setBrandKit] = useState<BrandKit>(DEFAULT_BRAND_KIT);
    const [showBrandKitModal, setShowBrandKitModal] = useState(false);

    // History
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // UI Modals
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // Generation State
    const [isLoading, setIsLoading] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [result, setResult] = useState<PromptResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Toast
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Loading message rotation
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const loadingIntervalRef = useRef<number | null>(null);

    // Check API Key on mount
    useEffect(() => {
        chrome.storage.local.get(['geminiApiKey'], (result) => {
            setHasApiKey(!!result.geminiApiKey);
            if (!result.geminiApiKey) {
                setShowSettingsModal(true);
            }
        });
    }, []);

    // Load Brand Kit from storage
    useEffect(() => {
        chrome.storage.local.get(['brandKit'], (result) => {
            if (result.brandKit) {
                setBrandKit(result.brandKit);
            }
        });
    }, []);

    // Load History from storage
    useEffect(() => {
        chrome.storage.local.get(['history'], (result) => {
            if (result.history) {
                setHistory(result.history);
            }
        });
    }, []);

    // Save Brand Kit to storage
    useEffect(() => {
        if (brandKit.brandName || brandKit.enabled) {
            chrome.storage.local.set({ brandKit });
        }
    }, [brandKit]);

    // Save History to storage
    useEffect(() => {
        chrome.storage.local.set({ history });
    }, [history]);

    // Auto-hide toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Loading message rotation
    useEffect(() => {
        if (isLoading) {
            setLoadingMessageIndex(0);
            loadingIntervalRef.current = window.setInterval(() => {
                setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
            }, 2500);
        } else {
            if (loadingIntervalRef.current !== null) {
                clearInterval(loadingIntervalRef.current);
                loadingIntervalRef.current = null;
            }
        }
        return () => {
            if (loadingIntervalRef.current !== null) {
                clearInterval(loadingIntervalRef.current);
            }
        };
    }, [isLoading]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    const handleGenerate = async () => {
        // Validation
        if (taskType === 'image-to-prompt' && referenceImages.length === 0) {
            showToast('กรุณาอัปโหลดรูปภาพที่ต้องการแกะสูตร', 'error');
            return;
        }

        if (taskType !== 'image-to-prompt' && !contentInput.trim()) {
            showToast('กรุณาใส่เนื้อหา/หัวข้อที่ต้องการสร้างภาพ', 'error');
            return;
        }

        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const generatedResult = await generateNanoPrompt(
                taskType,
                contentInput,
                referenceImages,
                referenceIntents,
                textInImage,
                fontName,
                style,
                negativePrompt,
                additionalDetails,
                userAspectRatio,
                userResolution,
                brandKit
            );

            setResult(generatedResult);

            // Add to history
            const historyItem: HistoryItem = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                taskType,
                contentInput: contentInput || 'Image-to-Prompt',
                result: generatedResult,
                isFavorite: false
            };

            setHistory(prev => [historyItem, ...prev].slice(0, 50)); // Keep max 50 items

            showToast('สร้าง Prompt สำเร็จ!', 'success');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAutoFill = async (text: string) => {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'insertPrompt',
                text,
            });

            if (response?.success) {
                showToast('กรอกข้อความสำเร็จ!', 'success');
            } else {
                showToast(response?.error || 'ไม่สามารถกรอกข้อความได้', 'error');
            }
        } catch {
            showToast('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
        }
    };

    const handleApiKeySaved = () => {
        setHasApiKey(true);
        setShowSettingsModal(false);
        showToast('บันทึก API Key สำเร็จ!', 'success');
    };

    const handleToggleIntent = (intentId: string) => {
        setReferenceIntents(prev =>
            prev.includes(intentId)
                ? prev.filter(id => id !== intentId)
                : [...prev, intentId]
        );
    };

    const handleFavoriteHistory = (id: string) => {
        setHistory(prev =>
            prev.map(item =>
                item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
            )
        );
    };

    const handleDeleteHistory = (id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    };

    const handleLoadFromHistory = (item: HistoryItem) => {
        setTaskType(item.taskType);
        setContentInput(item.contentInput);
        setResult(item.result);
        setShowHistory(false);
        showToast('โหลดจากประวัติสำเร็จ!', 'success');
    };

    const handleRefine = async (refinementInstruction: string) => {
        if (!result) return;

        setIsRefining(true);
        setError(null);

        try {
            const refinedResult = await refineNanoPrompt(result, refinementInstruction);
            setResult(refinedResult);
            showToast('แก้ไข Prompt สำเร็จ!', 'success');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการแก้ไข';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setIsRefining(false);
        }
    };

    const isImageToPrompt = taskType === 'image-to-prompt';
    const isCustom = taskType === 'custom';

    // Loading state
    if (hasApiKey === null) {
        return (
            <div className="min-h-screen bg-[#FEF9E7] flex items-center justify-center">
                <div className="animate-pulse text-amber-600">กำลังโหลด...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FEF9E7] text-stone-800 flex flex-col relative">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 sticky top-0 z-20 shadow-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✨</span>
                        <h1 className="text-lg font-bold text-white">
                            ช่วยสร้าง Prompt <span className="text-xs font-normal text-slate-400 ml-2 border border-slate-600 px-1.5 py-0.5 rounded">Gemini 3 Flash</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Brand Kit Button */}
                        <button
                            onClick={() => setShowBrandKitModal(true)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm relative ${brandKit.enabled
                                ? 'bg-amber-500 border-amber-500 text-white shadow-lg'
                                : 'border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white'
                                }`}
                            title="Brand Kit"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Brand Kit
                            {brandKit.enabled && (
                                <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-slate-800">
                                    ✓
                                </span>
                            )}
                        </button>

                        {/* History Button */}
                        <button
                            onClick={() => setShowHistory(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-sm relative"
                            title="ประวัติ"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ประวัติ
                            {history.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {history.length}
                                </span>
                            )}
                        </button>

                        {/* Settings Button */}
                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                            title="ตั้งค่า"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Brand Kit Indicator */}
                {brandKit.enabled && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 border border-amber-200">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Brand Kit เปิดอยู่: {brandKit.brandName}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 overflow-y-auto pb-20 space-y-4">
                {/* Task Type Selector */}
                <TaskTypeSelector
                    selectedType={taskType}
                    onSelectType={setTaskType}
                />

                {/* Content Input or Image Upload */}
                {isImageToPrompt ? (
                    <div className="glass rounded-xl overflow-hidden shadow-md">
                        <div className="px-4 py-4 border-b border-stone-100 bg-white">
                            <h2 className="text-lg font-bold text-stone-800 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white text-base font-bold shadow-sm">2</span>
                                อัปโหลดรูปที่ต้องการแกะสูตร
                            </h2>
                        </div>
                        <div className="p-4">
                            <UploadArea
                                selectedImages={referenceImages}
                                onImagesChange={setReferenceImages}
                                isImageToPromptMode={true}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Content Input */}
                        <div className="glass rounded-xl overflow-hidden shadow-md">
                            <div className="px-4 py-4 border-b border-stone-100 bg-white">
                                <h2 className="text-lg font-bold text-stone-800 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white text-base font-bold shadow-sm">2</span>
                                    ระบุความต้องการ
                                </h2>
                            </div>
                            <div className="p-4">
                                <textarea
                                    value={contentInput}
                                    onChange={(e) => setContentInput(e.target.value)}
                                    placeholder="เช่น: โปรโมทคอร์สออนไลน์เรียน AI สำหรับมือใหม่"
                                    className="w-full h-24 p-3 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm resize-none"
                                />
                            </div>
                        </div>

                        {/* Reference Images */}
                        <div className="glass rounded-xl overflow-hidden shadow-md">
                            <div className="px-4 py-4 border-b border-stone-100 bg-white">
                                <h2 className="text-lg font-bold text-stone-800 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white text-base font-bold shadow-sm">3</span>
                                    รูปอ้างอิง (ถ้ามี)
                                </h2>
                            </div>
                            <div className="p-4">
                                <UploadArea
                                    selectedImages={referenceImages}
                                    onImagesChange={setReferenceImages}
                                    isImageToPromptMode={false}
                                />

                                {referenceImages.length > 0 && (
                                    <ReferenceIntentSelector
                                        selectedIntents={referenceIntents}
                                        onToggleIntent={handleToggleIntent}
                                        isCustomMode={isCustom}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Advanced Settings */}
                <div className="glass rounded-xl overflow-hidden shadow-md p-4">
                    <AdvancedSettings
                        isExpanded={advancedExpanded}
                        onToggle={() => setAdvancedExpanded(!advancedExpanded)}
                        isImageToPrompt={isImageToPrompt}
                        userAspectRatio={userAspectRatio}
                        userResolution={userResolution}
                        style={style}
                        fontName={fontName}
                        textInImage={textInImage}
                        negativePrompt={negativePrompt}
                        additionalDetails={additionalDetails}
                        onAspectRatioChange={setUserAspectRatio}
                        onResolutionChange={setUserResolution}
                        onStyleChange={setStyle}
                        onFontChange={setFontName}
                        onTextInImageChange={setTextInImage}
                        onNegativePromptChange={setNegativePrompt}
                        onAdditionalDetailsChange={setAdditionalDetails}
                        brandKitEnabled={brandKit.enabled}
                    />
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${isLoading
                        ? 'bg-slate-700 text-white cursor-wait'
                        : 'btn-gradient text-amber-900 hover:shadow-xl active:scale-95'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span className="animate-fade-in">{LOADING_MESSAGES[loadingMessageIndex]}</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            สร้าง Prompt
                        </>
                    )}
                </button>

                {/* Error Display */}
                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
                        ⚠️ {error}
                    </div>
                )}

                {/* Result */}
                {result && (
                    <ResultCard
                        result={result}
                        onAutoFill={handleAutoFill}
                        onRefine={handleRefine}
                        isRefining={isRefining}
                        showToast={showToast}
                    />
                )}
            </main>

            {/* Modals */}
            {showBrandKitModal && (
                <BrandKitModal
                    isOpen={showBrandKitModal}
                    brandKit={brandKit}
                    onClose={() => setShowBrandKitModal(false)}
                    onUpdate={setBrandKit}
                />
            )}

            {showHistory && (
                <HistorySidebar
                    isOpen={showHistory}
                    history={history}
                    onClose={() => setShowHistory(false)}
                    onFavorite={handleFavoriteHistory}
                    onDelete={handleDeleteHistory}
                    onLoad={handleLoadFromHistory}
                />
            )}

            {showSettingsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="glass bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border border-stone-200">
                        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 flex justify-between items-center shadow-md">
                            <h3 className="text-lg font-bold text-white">ตั้งค่า API Key</h3>
                            {hasApiKey && (
                                <button onClick={() => setShowSettingsModal(false)} className="text-white/80 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="p-6">
                            <Settings onSaved={handleApiKeySaved} showToast={showToast} />
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed bottom-4 left-4 right-4 p-3 rounded-xl text-sm font-medium animate-slide-up z-50 shadow-lg ${toast.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                >
                    {toast.type === 'success' ? '✓' : '⚠️'} {toast.message}
                </div>
            )}
        </div>
    );
};

export default App;
