# FlowMate Pro - Testing Guide

## 🚀 Quick Start: Load Extension

### Step 1: Build Extension (Already Done ✅)
```bash
cd C:\Users\ADMIN\.gemini\antigravity\scratch\flowmate
npm run build
```

### Step 2: Load in Chrome

1. Open Chrome browser
2. Navigate to: `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **"Load unpacked"**
5. Select folder: `C:\Users\ADMIN\.gemini\antigravity\scratch\flowmate\dist`
6. Extension should appear with FlowMate icon

---

## ✅ Testing Checklist

### Test 1: Extension Loading & Settings ⭐ CRITICAL

**Steps:**
1. After loading extension, click FlowMate icon in toolbar
2. Side Panel should open
3. **Expected:** Settings modal appears (no API key yet)
4. Enter your Gemini API Key
5. Click "บันทึก"
6. **Expected:** Modal closes, toast shows "บันทึก API Key สำเร็จ!"

**Verify:**
- [ ] Extension loads without console errors (F12)
- [ ] Settings modal appears first time
- [ ] API Key saves to chrome.storage
- [ ] Can reopen settings via header ⚙️ button

---

### Test 2: Task Type Selector

**Steps:**
1. Click each of 5 task type buttons:
   - ภาพปก (Cover)
   - Infographic
   - ภาพประกอบ (Illustration)
   - แกะสูตรภาพ (Image-to-Prompt) - purple theme
   - โหมดเนรมิต (Custom)

**Verify:**
- [ ] Active state highlighted (blue border)
- [ ] Description text changes
- [ ] UI adjusts (Content Input vs Image Upload)

---

### Test 3: Multi-Image Upload

**Steps:**
1. Select task type: "Custom"
2. Drag 3 images into upload area
3. Verify all 3 previews appear in 2-column grid
4. Hover over image 2 → delete button appears
5. Click delete on image 2
6. Add 2 more images
7. Check count shows "(4 รูป)"

**Verify:**
- [ ] Multi-image upload works
- [ ] Preview grid displays correctly
- [ ] Individual delete buttons work
- [ ] File count accurate
- [ ] "Delete All" button works

---

### Test 4: Reference Intent Selector

**Steps:**
1. Task type: "Cover" (not Image-to-Prompt)
2. Upload 2 images
3. Reference Intent section should appear
4. Select intents: Mood, Color, Lighting
5. Verify blue highlight on selected

**Verify:**
- [ ] Section only shows with images (not in Image-to-Prompt mode)
- [ ] Multi-select works
- [ ] Visual feedback correct
- [ ] Deselect removes highlight

---

### Test 5: Advanced Settings

**Steps:**
1. Click "⚙️ การตั้งค่าขั้นสูง"
2. Section expands
3. Test each option:
   - Select Aspect Ratio: 16:9, 1:1, 9:16
   - Change Resolution: 1K, 2K, 4K
   - Click Style cards: Photorealistic, 3D Render, Flat Illustration
   - Select Font: "Kanit"
   - Enter Text in Image: "SALE 50%"
   - Enter Negative Prompt: "คน, สัตว์"
   - Enter Additional Details: "โทนสีอบอุ่น"

**Verify:**
- [ ] Collapsible section works
- [ ] All selectors update state
- [ ] Visual feedback on selections
- [ ] Style selector hidden in Image-to-Prompt mode

---

### Test 6: Brand Kit System

**Steps:**
1. Click "🎨 Brand Kit" button in header
2. Modal opens
3. Fill all fields:
   - Brand Name: "My Brand"
   - Brand Color: "#FF6B6B, #4ECDC4"
   - Brand Font: "Kanit"
   - Mood: "Modern, Minimalist"
   - Context: "Tech startup"
4. Toggle "เปิดใช้งาน Brand Kit" ON
5. Click "บันทึกและปิด"
6. Verify blue badge appears in header: "Brand Kit เปิดอยู่: My Brand"

**Persistence Test:**
7. Reload extension (close & reopen side panel)
8. Open Brand Kit modal again
9. Verify all data still there

**Verify:**
- [ ] Modal opens/closes correctly
- [ ] All fields save
- [ ] Toggle works
- [ ] Header indicator shows when active
- [ ] Data persists after reload
- [ ] Font selector disabled when Brand Kit active

---

### Test 7: Image-to-Prompt Mode ⭐ ORIGINAL FEATURE

**Steps:**
1. Select task type: "แกะสูตรภาพ (Image-to-Prompt)"
2. Upload 1 test image
3. Click "สร้าง Prompt"
4. Watch loading state (rotating messages)
5. Wait for result

**Verify:**
- [ ] Loading messages rotate every 2.5s
- [ ] Result has 4 sections: Thai, English, Reasoning, Specs
- [ ] Thai Prompt has Golden Formula structure (7 sections)
- [ ] Bold headers visible (** format)
- [ ] No colons (:) in headers
- [ ] Copy button works
- [ ] Auto-Fill button visible

---

### Test 8: Other Task Types (Cover, Infographic, Illustration, Custom)

**For each task type:**

**Cover:**
1. Content Input: "คอร์สเรียน AI ฟรี !"
2. Upload 1 reference image (optional)
3. Style: "Flat Illustration"
4. Text in Image: "AI COURSE"
5. Generate

**Infographic:**
1. Content Input: "สถิติการใช้ Social Media ในไทย 2024"
2. Style: "Minimalist"
3. Generate

**Illustration:**
1. Content Input: "เด็กน้อยกำลังอ่านหนังสือใต้ต้นไม้ใหญ่"
2. Style: "Auto"
3. Generate

**Custom:**
1. Content Input: "Cyberpunk city at night"
2. Upload 2 reference images
3. Select Intents: Mood, Color, Lighting
4. Style: "Cyberpunk"
5. Generate

**Verify:**
- [ ] All task types generate successfully
- [ ] Result structure consistent
- [ ] Golden Formula in Thai Prompt
- [ ] Each adds to History

---

### Test 9: History System

**Steps:**
1. After generating 3+ prompts
2. Click "🕐 ประวัติ" button in header
3. Sidebar slides in from right
4. Verify 3 items listed
5. Click ❤️ on item 2 (favorite)
6. Switch to "⭐ รายการโปรด" tab
7. Verify only favorited item shows
8. Switch back to "ทั้งหมด" tab
9. Click 🗑️ delete on item 3
10. Confirm deletion
11. Click "นำกลับมาใช้ใหม่" on item 1
12. Verify it loads into main UI

**Verify:**
- [ ] Sidebar slide animation smooth
- [ ] All items display correctly
- [ ] Favorite toggle works
- [ ] Tabs filter correctly
- [ ] Delete works
- [ ] Load from history restores state
- [ ] Data persists after reload

---

### Test 10: Refine Prompt Feature

**Steps:**
1. Generate a prompt (any task type)
2. In result card, click "แก้ไข Prompt (Refine)" button
3. Purple input section expands
4. Enter: "เปลี่ยนเป็นโทนสีเย็น เพิ่มบรรยากาศน่ากลัว"
5. Click "แก้ไข Prompt"
6. Watch loading spinner
7. Wait for new result

**Verify:**
- [ ] Refine input collapsible UI works
- [ ] Loading state shows
- [ ] New result replaces old one
- [ ] Toast notification: "แก้ไข Prompt สำเร็จ!"
- [ ] Can refine multiple times
- [ ] Error handling if refine fails

---

### Test 11: Auto-Fill Feature (Regression Test) ⭐ CRITICAL

**Steps:**
1. Open new tab: `https://gemini.google.com`
2. Keep FlowMate Side Panel open
3. Generate a prompt in FlowMate
4. Click "✨ กรอกอัตโนมัติ" button
5. Check Gemini textarea

**Verify:**
- [ ] Auto-Fill still works (no regression)
- [ ] Prompt inserted correctly
- [ ] Toast shows "กรอกข้อความสำเร็จ!"

---

### Test 12: Brand Kit Integration (AI Test)

**Steps:**
1. Enable Brand Kit with:
   - Name: "TechCo"
   - Color: "#3B82F6, #8B5CF6"
   - Font: "Kanit"
   - Mood: "Professional, Modern"
2. Generate a Cover prompt with content: "เปิดตัวสินค้าใหม่"
3. Check Thai Prompt result

**Verify:**
- [ ] Result includes "BRAND IDENTITY" section
- [ ] Brand name, colors, font, mood mentioned
- [ ] AI respects brand guidelines

- [ ] AI respects brand guidelines

---

### Test 13: Banana Cream Theme UI 🆕 (Visual Check)

**Steps:**
1. Browse through all tabs (Home, Settings, History)
2. Check color scheme
3. Check font readability

**Verify:**
- [ ] Background is warm Cream (#FEF9E7)
- [ ] Cards are White with subtle borders
- [ ] Font is "Sarabun" (Thai) - clean and readable
- [ ] Text is Dark Brown/Grey (not harsh black)
- [ ] Amber/Yellow accents present
- [ ] No dark mode remnants (except specific dark elements if any)

---

## 🐛 Edge Cases & Error Handling

### Edge Case 1: Empty Inputs
**Steps:**
1. Select "Cover" mode
2. Leave Content Input empty
3. Click "สร้าง Prompt"

**Expected:** ❌ Toast error: "กรุณาใส่เนื้อหา/หัวข้อที่ต้องการสร้างภาพ"

### Edge Case 2: No API Key
**Steps:**
1. Clear chrome.storage (DevTools → Application → Storage)
2. Reload extension
3. Try to generate

**Expected:** ⚙️ Settings modal opens automatically, error message shown

### Edge Case 3: Invalid API Key
**Steps:**
1. Enter fake API key: "abc123"
2. Try to generate

**Expected:** ❌ Error toast: "API Key ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง"

### Edge Case 4: History Limit (50 items)
**Steps:**
1. Generate 51 prompts
2. Check history count

**Expected:** Only latest 50 items kept (oldest auto-deleted)

---

## 📊 Console Check (F12)

**Open DevTools → Console**

**Should NOT see:**
- ❌ TypeScript errors
- ❌ Network errors (429, 401, 403 except for API issues)
- ❌ React warnings
- ❌ Storage errors

**OK to see:**
- ⚠️ CSS warnings about @tailwind (expected)
- ℹ️ Chrome extension info messages

---

## ✅ Final Verification

**All Features Working:**
- [ ] 1. Extension loads
- [ ] 2. Settings save
- [ ] 3. Task types switch
- [ ] 4. Multi-image upload
- [ ] 5. Reference intents
- [ ] 6. Advanced settings
- [ ] 7. Brand Kit (save/persist/integrate)
- [ ] 8. Image-to-Prompt generates
- [ ] 9. Other 4 task types generate
- [ ] 10. History (save/favorite/delete/load)
- [ ] 11. Refine feature
- [ ] 12. Auto-Fill works
- [ ] 13. Banana Cream Theme OK

**If ALL ✅ → Ready for Production! 🎉**

---

## 🚨 Known Issues (Non-Blocking)

1. **CSS Lint Warnings:** `@tailwind` directives show warnings - this is expected and doesn't affect functionality
2. **localStorage Type Warnings:** Minor TypeScript warnings in chrome.storage - doesn't affect runtime

---

## 📝 Test Results Log

**Date:** 2026-02-08  
**Tester:** [Your Name]  
**Extension Version:** 2.0 Pro

| Test # | Feature | Status | Notes |
|--------|---------|--------|-------|
| 1 | Extension Loading | ⏳ | |
| 2 | Task Type Selector | ⏳ | |
| 3 | Multi-Image Upload | ⏳ | |
| 4 | Reference Intent | ⏳ | |
| 5 | Advanced Settings | ⏳ | |
| 6 | Brand Kit | ⏳ | |
| 7 | Image-to-Prompt | ⏳ | |
| 8 | Other Task Types | ⏳ | |
| 9 | History System | ⏳ | |
| 10 | Refine Prompt | ⏳ | |
| 11 | Auto-Fill | ⏳ | |
| 12 | Brand Kit AI | ⏳ | |
| 13 | Banana Cream Theme | ⏳ | |

**Legend:** ⏳ Pending | ✅ Pass | ❌ Fail

---

**Ready to Test!** 🚀
