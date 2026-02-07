import React from 'react';
import { HistoryItem } from '../../types';

interface HistorySidebarProps {
    isOpen: boolean;
    history: HistoryItem[];
    onClose: () => void;
    onFavorite: (id: string) => void;
    onDelete: (id: string) => void;
    onLoad: (item: HistoryItem) => void;
}

const TASK_TYPE_COLORS = {
    'cover': 'bg-blue-500',
    'infographic': 'bg-green-500',
    'illustration': 'bg-purple-500',
    'image-to-prompt': 'bg-pink-500',
    'custom': 'bg-orange-500'
};

const TASK_TYPE_LABELS = {
    'cover': 'ภาพปก',
    'infographic': 'Infographic',
    'illustration': 'ภาพประกอบ',
    'image-to-prompt': 'แกะสูตร',
    'custom': 'เนรมิต'
};

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
    isOpen,
    history,
    onClose,
    onFavorite,
    onDelete,
    onLoad
}) => {
    const [activeTab, setActiveTab] = React.useState<'all' | 'favorites'>('all');

    const filteredHistory = activeTab === 'all'
        ? history
        : history.filter(item => item.isFavorite);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

        if (diffMinutes < 1) return 'เมื่อสักครู่';
        if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays} วันที่แล้ว`;

        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex justify-end animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-sm h-full bg-[#FEF9E7] shadow-2xl flex flex-col animate-slide-left border-l border-stone-200">
                {/* Header */}
                <div className="px-5 py-4 bg-slate-800 flex justify-between items-center shadow-lg">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ประวัติการสร้าง
                    </h3>
                    <button onClick={onClose} className="text-slate-200 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-stone-200 bg-white">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === 'all'
                            ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
                            : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                            }`}
                    >
                        ทั้งหมด ({history.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === 'favorites'
                            ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
                            : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                            }`}
                    >
                        ⭐ รายการโปรด ({history.filter(h => h.isFavorite).length})
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-3 py-4">
                    {filteredHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-stone-400">
                            <svg className="w-16 h-16 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm">ยังไม่มีประวัติ</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredHistory.map((item) => (
                                <div
                                    key={item.id}
                                    className="glass bg-white rounded-xl p-4 border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all group"
                                >
                                    {/* Task Type Badge */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full text-white ${TASK_TYPE_COLORS[item.taskType]}`}>
                                            {TASK_TYPE_LABELS[item.taskType]}
                                        </span>
                                        <div className="flex gap-1.5">
                                            {/* Favorite */}
                                            <button
                                                onClick={() => onFavorite(item.id)}
                                                className={`p-1.5 rounded transition-all active:scale-90 ${item.isFavorite
                                                    ? 'text-yellow-500 hover:text-yellow-600'
                                                    : 'text-stone-400 hover:text-yellow-500'
                                                    }`}
                                                title="โปรด"
                                            >
                                                <svg className="w-4 h-4" fill={item.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            </button>
                                            {/* Delete */}
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="p-1.5 text-stone-400 hover:text-red-500 rounded transition-all active:scale-90"
                                                title="ลบ"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <p className="text-sm text-stone-800 font-medium mb-1.5 line-clamp-2">
                                        {item.contentInput || 'ไม่มีข้อมูล'}
                                    </p>

                                    {/* Timestamp */}
                                    <p className="text-[10px] text-stone-500 mb-3">
                                        {formatDate(item.timestamp)}
                                    </p>

                                    {/* Load Button */}
                                    <button
                                        onClick={() => onLoad(item)}
                                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm"
                                    >
                                        นำกลับมาใช้ใหม่
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
