// FlowMate - Background Service Worker

// เปิด Side Panel เมื่อคลิกที่ Extension Icon
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error('Error setting panel behavior:', error));

// รับ message จาก Side Panel แล้วส่งต่อไปยัง Content Script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === 'insertPrompt') {
        // ส่ง prompt ไปยัง active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: 'insertPrompt', text: message.text },
                    (response) => {
                        if (chrome.runtime.lastError) {
                            sendResponse({ success: false, error: 'ไม่สามารถเชื่อมต่อกับหน้าเว็บได้' });
                        } else {
                            sendResponse(response);
                        }
                    }
                );
            } else {
                sendResponse({ success: false, error: 'ไม่พบ active tab' });
            }
        });
        return true; // Keep the message channel open for async response
    }
});

console.log('FlowMate background service worker initialized');
