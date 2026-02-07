import React, { useState, useEffect } from 'react';

interface SettingsProps {
    onSaved: () => void;
    showToast: (message: string, type: 'success' | 'error') => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSaved, showToast }) => {
    const [apiKey, setApiKey] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showKey, setShowKey] = useState(false);

    // โหลด API Key ที่บันทึกไว้
    useEffect(() => {
        chrome.storage.local.get(['geminiApiKey'], (result) => {
            if (result.geminiApiKey) {
                setApiKey(result.geminiApiKey);
            }
        });
    }, []);

    const handleSave = async () => {
        if (!apiKey.trim()) {
            showToast('กรุณากรอก API Key', 'error');
            return;
        }

        setIsSaving(true);
        try {
            await chrome.storage.local.set({ geminiApiKey: apiKey.trim() });
            onSaved();
        } catch {
            showToast('ไม่สามารถบันทึกได้', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleClear = async () => {
        try {
            await chrome.storage.local.remove('geminiApiKey');
            setApiKey('');
            showToast('ลบ API Key เรียบร้อย', 'success');
        } catch {
            showToast('ไม่สามารถลบได้', 'error');
        }
    };

    return (
        <div className="space-y-6">
            {/* API Key Section */}
            <div className="glass rounded-xl p-4">
                <h3 className="text-sm font-semibold text-stone-800 mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Gemini API Key
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                    รับ API Key ได้ที่{' '}
                    <a
                        href="https://aistudio.google.com/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:underline"
                    >
                        Google AI Studio
                    </a>
                </p>

                {/* Input */}
                <div className="relative">
                    <input
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIza..."
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-stone-300 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-mono"
                    />
                    <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                        {showKey ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !apiKey.trim()}
                        className="flex-1 py-2.5 rounded-xl btn-gradient text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                กำลังบันทึก...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                บันทึก
                            </>
                        )}
                    </button>
                    {apiKey && (
                        <button
                            onClick={handleClear}
                            className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-medium transition-colors"
                        >
                            ลบ
                        </button>
                    )}
                </div>
            </div>



            {/* Credits */}
            <div className="text-center text-xs text-stone-400">
                <p>FlowMate v1.0</p>
                <p className="mt-1">Powered by Gemini AI ✨</p>
            </div>
        </div>
    );
};
