// FlowMate - Content Script for Auto-Fill
// ทำงานบน gemini.google.com, aistudio.google.com, labs.google

// ฟังก์ชันค้นหา textarea โดยรองรับ Shadow DOM
function findTextarea(root: Document | ShadowRoot | Element): HTMLTextAreaElement | HTMLElement | null {
    // ลองหา textarea ปกติก่อน
    const textarea = root.querySelector('textarea:not([readonly])') as HTMLTextAreaElement;
    if (textarea) return textarea;

    // ลองหา contenteditable
    const contentEditable = root.querySelector('[contenteditable="true"]') as HTMLElement;
    if (contentEditable) return contentEditable;

    // ลองหา rich-textarea component (Gemini specific)
    const richTextarea = root.querySelector('rich-textarea textarea') as HTMLTextAreaElement;
    if (richTextarea) return richTextarea;

    // ค้นหาใน Shadow DOM
    const allElements = root.querySelectorAll('*');
    for (const element of allElements) {
        if (element.shadowRoot) {
            const found = findTextarea(element.shadowRoot);
            if (found) return found;
        }
    }

    return null;
}

// ฟังก์ชัน simulate input events
function simulateInput(element: HTMLTextAreaElement | HTMLElement, text: string) {
    if (element instanceof HTMLTextAreaElement) {
        // สำหรับ textarea
        element.focus();
        element.value = text;

        // Dispatch events เพื่อให้เว็บรับรู้การเปลี่ยนแปลง
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
        // สำหรับ contenteditable
        element.focus();
        element.textContent = text;

        element.dispatchEvent(new InputEvent('input', {
            bubbles: true,
            inputType: 'insertText',
            data: text
        }));
    }
}

// รับ message จาก Background Script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'insertPrompt') {
        try {
            const targetElement = findTextarea(document);

            if (targetElement) {
                simulateInput(targetElement, message.text);
                sendResponse({ success: true });
            } else {
                sendResponse({
                    success: false,
                    error: 'ไม่พบช่องพิมพ์ข้อความ กรุณาลองคลิกที่ช่องพิมพ์ก่อน'
                });
            }
        } catch (error) {
            sendResponse({
                success: false,
                error: `เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        }
        return true;
    }
});

console.log('FlowMate content script loaded');
