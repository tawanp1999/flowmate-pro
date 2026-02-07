import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PromptResult, TaskType, BrandKit } from "../types";

// Response Schema สำหรับ Gemini API
const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        thaiPrompt: {
            type: Type.STRING,
            description: "The professional-grade structured Thai prompt using Markdown. MUST follow Golden Formula with **Bold Headers**. STRICTLY NO COLONS (:).",
        },
        englishTranslation: {
            type: Type.STRING,
            description: "English translation of the prompt for reference.",
        },
        reasoning: {
            type: Type.STRING,
            description: "Explanation in Thai language only (ภาษาไทย) of why this prompt works.",
        },
        suggestedParameters: {
            type: Type.OBJECT,
            properties: {
                aspectRatio: { type: Type.STRING },
                style: { type: Type.STRING },
            },
            required: ["aspectRatio", "style"],
        },
    },
    required: ["thaiPrompt", "englishTranslation", "reasoning", "suggestedParameters"],
};

// System Instruction - Golden Formula
const GOLDEN_FORMULA_INSTRUCTION = `
You are a **Senior Art Director & Prompt Engineer** with expertise in creating professional-grade image generation prompts.

**THE GOLDEN FORMULA (Structure of Output Prompt):**
Organize the 'thaiPrompt' into 7 sections using **Bold Headers** (STRICTLY NO COLONS):

1. **ตัวแบบและการกระทำ**
   Main subject, pose, expression, gesture, action, emotion, facial details

2. **มุมกล้องและการจัดวาง**
   Camera angle, shot type, framing, composition rules, focal point, depth of field

3. **ฉากหลังและแสง**
   Background details, environment, setting, time of day, lighting direction, light quality, shadows, highlights, atmosphere

4. **สไตล์และโทนสี**
   Art style, visual aesthetic, color palette, color temperature, mood, vibe, textures, materials

5. **งานตัวอักษร** *(only if text is required)*
   Font style, typography, text placement, text color, text effects, text integration with design

6. **สเปคทางเทคนิค**
   Aspect ratio, resolution, render quality, detail level, professional specifications

7. **สิ่งที่ไม่มีในภาพ**
   Things to avoid in the final image (negative elements)

**OUTPUT FORMAT RULES (for readability, NOT for limiting detail):**
1. **Use double line breaks (\\n\\n) between sections** - for clean visual separation
2. **Each section header on its own line** - for clear structure
3. **Content starts on new line after header** - for organization
4. **Maintain professional structure** - well-organized but DETAILED content

**CRITICAL RULES:**
1. **STRICTLY NO COLONS (:)** - Use newlines or spacing instead
2. **Thai Language** - The thaiPrompt MUST be in Thai
3. **Space before Question Mark** - Always use " ?" (e.g., "สวยไหม ?")
4. **MAXIMUM DETAIL for PROFESSIONAL RESULTS** - Describe EVERYTHING extensively: lighting direction, shadow quality, color nuances, textures, materials, atmosphere, mood. Think like a professional photographer and art director. More detail = better image quality.
5. **Bold Headers Only** - Use **Header** format, never "Header:"
6. **🚫 ABSOLUTELY NO BRAND NAMES OR LOGOS** - NEVER include any brand names, brand logos, company names, or branded text in ANY section of the prompt.
7. **Clean Structure with Rich Content** - Each section should be well-separated (double line breaks) but PACKED with professional details

**QUALITY PRIORITY:**
Your goal is to create prompts that will generate **professional, high-quality images** as if created by expert graphic designers. 
Sacrifice brevity for quality. Include:
- Specific lighting details (direction, quality, color temperature)
- Precise color descriptions (not just "blue" but "deep cerulean blue with subtle turquoise highlights")
- Texture and material details
- Atmospheric elements
- Professional photography/design terminology
`;

// ดึง API Key
async function getApiKey(): Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['geminiApiKey'], (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error('ไม่สามารถอ่าน Storage ได้'));
                return;
            }
            if (!result.geminiApiKey) {
                reject(new Error('กรุณาตั้งค่า API Key ในหน้า "ตั้งค่า" ก่อน'));
                return;
            }
            resolve(result.geminiApiKey);
        });
    });
}

// แปลง File เป็น Base64
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(",")[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Build Brand Kit text
function buildBrandKitText(brandKit: BrandKit): string {
    if (!brandKit.enabled) return '';

    let text = '\n\n**BRAND IDENTITY (ต้องใช้ตลอด)**\n';
    if (brandKit.brandName) text += `- Brand: ${brandKit.brandName}\n`;
    if (brandKit.brandColor) text += `- Colors: ${brandKit.brandColor}\n`;
    if (brandKit.brandFont) text += `- Font: ${brandKit.brandFont}\n`;
    if (brandKit.brandMood) text += `- Mood: ${brandKit.brandMood}\n`;
    if (brandKit.additionalContext) text += `- Context: ${brandKit.additionalContext}\n`;

    return text;
}

// Build Reference Intent text
function buildReferenceIntentText(intents: string[]): string {
    if (intents.length === 0) return 'อ้างอิงทุกด้านจากภาพ';

    const intentMap: Record<string, string> = {
        'mood': 'บรรยากาศโดยรวม (Mood)',
        'lighting': 'แสงและเงา (Lighting)',
        'style': 'ลายเส้น/สไตล์ภาพ (Style)',
        'color': 'ชุดสี (Color Palette)',
        'composition': 'การจัดวาง (Composition)',
        'camera': 'มุมกล้อง (Camera Angle)',
        'subject': 'ตัวละคร/วัตถุ (Subject)',
        'outfit': 'เสื้อผ้า (Costume)',
        'background': 'ฉากหลัง (Background)',
        'typography': 'ฟอนต์ (Typography)'
    };

    const labels = intents.map(id => intentMap[id] || id).join(', ');
    return `อ้างอิงเฉพาะ: ${labels}`;
}

// Build Task-Specific Instruction
function buildTaskInstruction(
    taskType: TaskType,
    contentInput: string,
    referenceImages: File[],
    referenceIntents: string[],
    textInImage: string,
    fontName: string,
    style: string,
    negativePrompt: string,
    additionalDetails: string,
    userAspectRatio: string,
    userResolution: string,
    brandKit: BrandKit
): string {
    let instruction = '';

    if (taskType === 'image-to-prompt') {
        instruction = `**TASK: REVERSE ENGINEERING**

Analyze ${referenceImages.length > 1 ? 'these images' : 'this image'} and create a detailed, professional prompt in Thai that could recreate ${referenceImages.length > 1 ? 'them' : 'it'}.

${buildReferenceIntentText(referenceIntents)}`;
    } else if (taskType === 'cover') {
        instruction = `**TASK: COVER IMAGE (ภาพปก)**

Create a prompt for an eye-catching cover image with headline text for: "${contentInput}"

Requirements:
- Must include visible headline text in the image
- Eye-catching and attention-grabbing
- Suitable for Facebook, YouTube, Blog covers`;
    } else if (taskType === 'infographic') {
        instruction = `**TASK: INFOGRAPHIC**

Create a prompt for an explanatory infographic about: "${contentInput}"

Requirements:
- Educational and data-driven
- Clear visual hierarchy
- Text annotations and labels included`;
    } else if (taskType === 'illustration') {
        instruction = `**TASK: ILLUSTRATION (ภาพประกอบ)**

Create a prompt for a storytelling illustration about: "${contentInput}"

Requirements:
- Focus on storytelling and emotion
- NO TEXT in the final image (pure illustration)
- Atmospheric and narrative-driven`;
    } else if (taskType === 'custom') {
        instruction = `**TASK: CUSTOM CREATIVE VISION (โหมดเนรมิต)**

Free-form prompt creation for: "${contentInput}"

You have complete creative freedom. Combine elements as requested.`;
    }

    // Add reference images context
    if (referenceImages.length > 0 && taskType !== 'image-to-prompt') {
        instruction += `\n\nReference Images Provided (${referenceImages.length}):
${buildReferenceIntentText(referenceIntents)}`;
    }

    // Add specs
    if (taskType !== 'image-to-prompt') {
        instruction += `\n\n**User Specifications:**`;
        if (textInImage) instruction += `\n- Text in Image: "${textInImage}"`;
        if (fontName && fontName !== 'Auto') instruction += `\n- Font: ${fontName}`;
        if (style && style !== 'Auto') instruction += `\n- Style: ${style}`;

        // CRITICAL: Always exclude brand logos and brand names (hard-coded)
        const autoExcludedTerms = 'โลโก้แบรนด์, ชื่อแบรนด์';
        const combinedNegative = negativePrompt
            ? `${negativePrompt}, ${autoExcludedTerms}`
            : autoExcludedTerms;
        instruction += `\n- Avoid: ${combinedNegative}`;

        instruction += `\n- Aspect Ratio: ${userAspectRatio}`;
        instruction += `\n- Resolution: ${userResolution}`;
        if (additionalDetails) instruction += `\n- Additional: ${additionalDetails}`;

        // Brand Kit
        instruction += buildBrandKitText(brandKit);
    } else if (additionalDetails) {
        instruction += `\n\nAdditional Context: ${additionalDetails}`;
    }

    instruction += `\n\nCreate a professional, structured Thai prompt following the Golden Formula (7 sections).`;

    return instruction;
}

// Get optimal thinking level for task type
function getThinkingLevel(taskType: TaskType, imageCount: number): string {
    switch (taskType) {
        case 'image-to-prompt':
            return 'high'; // Deep analysis required
        case 'custom':
            return imageCount > 2 ? 'high' : 'medium'; // Complex multi-image synthesis
        case 'cover':
        case 'infographic':
        case 'illustration':
        default:
            return 'medium'; // Standard creative tasks
    }
}

// NEW: Main function for all task types
export async function generateNanoPrompt(
    taskType: TaskType,
    contentInput: string,
    referenceImages: File[],
    referenceIntents: string[],
    textInImage: string,
    fontName: string,
    style: string,
    negativePrompt: string,
    additionalDetails: string,
    userAspectRatio: string,
    userResolution: string,
    brandKit: BrandKit
): Promise<PromptResult> {
    try {
        const apiKey = await getApiKey();
        const ai = new GoogleGenAI({ apiKey });

        const parts: any[] = [];

        // Add reference images
        for (const imageFile of referenceImages) {
            const base64Data = await fileToBase64(imageFile);
            parts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: imageFile.type,
                },
            });
        }

        // Add instruction text
        const instructionText = buildTaskInstruction(
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

        parts.push({ text: instructionText });

        // Determine optimal thinking level
        const thinkingLevel = getThinkingLevel(taskType, referenceImages.length);

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview", // Upgraded to Gemini 3 Flash
            contents: { parts },
            config: {
                systemInstruction: GOLDEN_FORMULA_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                thinkingConfig: {
                    thinkingLevel: thinkingLevel,
                },
            },
        });

        if (!response.text) {
            throw new Error("ไม่ได้รับการตอบกลับจาก Gemini API");
        }

        return JSON.parse(response.text) as PromptResult;
    } catch (error) {
        console.error("Error generating prompt:", error);

        if (error instanceof Error) {
            if (error.message.includes('API Key')) {
                throw new Error('กรุณาตั้งค่า API Key ในหน้า "ตั้งค่า"');
            }
            if (error.message.includes('401') || error.message.includes('403')) {
                throw new Error('API Key ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
            }
            if (error.message.includes('429')) {
                throw new Error('เกินจำนวนการใช้งาน API กรุณารอสักครู่');
            }
            throw error;
        }

        throw new Error('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    }
}

// Refine Prompt function
export async function refineNanoPrompt(
    currentResult: PromptResult,
    refinementInstruction: string
): Promise<PromptResult> {
    try {
        const apiKey = await getApiKey();
        const ai = new GoogleGenAI({ apiKey });

        const parts = [
            {
                text: `**TASK: REFINE EXISTING PROMPT**

Current Thai Prompt:
${currentResult.thaiPrompt}

User's Refinement Request: "${refinementInstruction}"

Create an improved version following the Golden Formula (7 sections). Keep the core structure but apply the requested changes.`,
            },
        ];

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview", // Upgraded to Gemini 3 Flash
            contents: { parts },
            config: {
                systemInstruction: GOLDEN_FORMULA_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                thinkingConfig: {
                    thinkingLevel: "low", // Refine is quick iteration
                },
            },
        });

        if (!response.text) {
            throw new Error("ไม่ได้รับการตอบกลับจาก Gemini API");
        }

        return JSON.parse(response.text) as PromptResult;
    } catch (error) {
        console.error("Error refining prompt:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('เกิดข้อผิดพลาดในการแก้ไข Prompt');
    }
}

// Legacy function for backward compatibility
export async function generateImagePrompt(imageFile: File): Promise<PromptResult> {
    // Use new function with default parameters
    return generateNanoPrompt(
        'image-to-prompt',
        '',
        [imageFile],
        [],
        '',
        'Auto',
        'Auto',
        '',
        '',
        '16:9',
        '2K',
        { enabled: false, brandName: '', brandColor: '', brandFont: '', brandMood: '', additionalContext: '' }
    );
}
