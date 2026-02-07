// Task Types
export type TaskType = 'cover' | 'infographic' | 'illustration' | 'image-to-prompt' | 'custom';

// Core Result Interface
export interface PromptResult {
    thaiPrompt: string;
    englishTranslation: string;
    reasoning: string;
    suggestedParameters: {
        aspectRatio: string;
        style: string;
    };
}

// Brand Kit Interface
export interface BrandKit {
    enabled: boolean;
    brandName: string;
    brandColor: string; // e.g., "Yellow #FFD452 and Dark Grey"
    brandFont: string; // e.g., "Kanit Medium"
    brandMood: string; // e.g., "Friendly, Modern, Energetic"
    additionalContext: string; // e.g., "We are a coffee shop for millennials"
}

// History Item Interface
export interface HistoryItem {
    id: string;
    timestamp: number;
    taskType: TaskType;
    contentInput: string;
    result: PromptResult;
    isFavorite: boolean;
}

// Complete Application State
export interface AppState {
    // Task Configuration
    taskType: TaskType;
    contentInput: string; // The content/topic text

    // Advanced Settings (only for non-image-to-prompt modes)
    textInImage: string; // Text to appear visibly in the image
    fontName: string; // Specific font family
    style: string; // Visual style (Auto, Photorealistic, 3D, etc.)
    negativePrompt: string; // Things to avoid
    additionalDetails: string; // Visual preferences or optional context

    // Technical Specs
    userAspectRatio: string; // e.g., "16:9", "1:1", "9:16"
    userResolution: string; // "1K", "2K", "4K"

    // Reference Images (Multi-image support)
    referenceImages: File[];
    referenceIntents: string[]; // e.g., ['mood', 'color', 'composition']

    // Brand Kit
    brandKit: BrandKit;

    // History System
    history: HistoryItem[];
    showHistory: boolean;

    // UI State
    showBrandKitModal: boolean;
    showSettingsModal: boolean;

    // Generation State
    isLoading: boolean;
    result: PromptResult | null;
    error: string | null;
}

// Legacy interface for backward compatibility (can be removed later)
export interface GenerationState {
    isLoading: boolean;
    result: PromptResult | null;
    error: string | null;
}
