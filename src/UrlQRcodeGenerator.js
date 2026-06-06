// ==UserScript==
// @name         网页URL二维码生成
// @namespace    http://yeyu1024.xyz
// @version      2.2
// @description  生成当前网页的地址(url)的二维码，方便手机扫描.支持二维码图片解析、Canvas二维码扫描(Alt+Q)
// @description:en Generate the QR code of the address of the current webpage (URL), which is convenient for mobile phone scanning
// @author       夜雨
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://www.the-qrcode-generator.com
// @require      https://cdn.bootcdn.net/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @require      https://cdn.jsdelivr.net/npm/jsqr/dist/jsQR.js
// @grant        GM_registerMenuCommand
// @homepageURL  https://greasyfork.org/zh-CN/scripts/480612
// @supportURL   https://greasyfork.org/zh-CN/scripts/480612
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 样式 ====================
    const STYLE = `
        .qr-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 9999998;
        }
        .qr-modal {
            z-index: 9999999;
            border-radius: 8px;
            padding: 16px;
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            min-width: 300px;
            max-width: 90vw;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .qr-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 4px;
        }
        .qr-modal-title {
            font-size: 15px;
            font-weight: 600;
            color: #333;
        }
        .qr-close {
            font-size: 20px;
            cursor: pointer;
            color: #999;
            line-height: 1;
            transition: color 0.2s;
        }
        .qr-close:hover {
            color: #333;
        }
        .qr-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px 0;
        }
        .qr-btn {
            cursor: pointer;
            color: white;
            border: none;
            outline: none;
            background: #4caf50;
            padding: 10px 0;
            border-radius: 4px;
            font-size: 14px;
            width: 200px;
            margin-top: 16px;
            transition: background 0.2s;
        }
        .qr-btn:hover {
            background: #43a047;
        }
        .qr-btn-secondary {
            background: #1a73e8;
        }
        .qr-btn-secondary:hover {
            background: #1565c0;
        }
        .qr-textarea {
            width: 240px;
            margin: 16px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
            font-size: 14px;
        }
        .qr-link {
            font-size: 12px;
            color: #1a73e8;
            text-decoration: none;
            margin-top: 8px;
        }
        .qr-link:hover {
            text-decoration: underline;
        }
        .qr-hint {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.75);
            color: #fff;
            padding: 10px 24px;
            border-radius: 4px;
            z-index: 9999999;
            font-size: 14px;
            pointer-events: none;
        }
        .qr-highlight {
            outline: 3px solid #4caf50 !important;
            outline-offset: 2px;
            cursor: crosshair !important;
        }
        canvas.qr-highlight {
            outline: 3px solid #ff9800 !important;
            outline-offset: 2px;
            cursor: crosshair !important;
            position: relative;
        }
        .qr-shortcut-tip {
            position: fixed;
            bottom: 12px;
            right: 12px;
            background: rgba(0,0,0,0.6);
            color: #fff;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999997;
            cursor: pointer;
            transition: opacity 0.3s;
            opacity: 0.5;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .qr-shortcut-tip:hover {
            opacity: 1;
            background: rgba(0,0,0,0.8);
        }
        .qr-shortcut-tip kbd {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 3px;
            padding: 1px 5px;
            font-size: 11px;
            font-family: inherit;
        }
        .qr-drop-zone {
            width: 260px;
            min-height: 120px;
            border: 2px dashed #ccc;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 13px;
            transition: all 0.2s;
            cursor: pointer;
            padding: 16px;
            text-align: center;
            gap: 8px;
        }
        .qr-drop-zone:hover {
            border-color: #4caf50;
            color: #4caf50;
        }
        .qr-drop-zone.qr-drag-over {
            border-color: #4caf50;
            background: #f1f8e9;
            color: #4caf50;
        }
        .qr-drop-zone-icon {
            font-size: 32px;
            line-height: 1;
        }
        .qr-tab-bar {
            display: flex;
            gap: 0;
            border-bottom: 1px solid #eee;
            margin-bottom: 12px;
            width: 100%;
        }
        .qr-tab {
            flex: 1;
            text-align: center;
            padding: 8px 4px;
            font-size: 13px;
            color: #666;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }
        .qr-tab:hover {
            color: #333;
        }
        .qr-tab.qr-tab-active {
            color: #4caf50;
            border-bottom-color: #4caf50;
            font-weight: 600;
        }
        .qr-tab-panel {
            display: none;
            width: 100%;
            align-items: center;
            flex-direction: column;
        }
        .qr-tab-panel.qr-tab-panel-active {
            display: flex;
        }
        .qr-url-input {
            width: 240px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            outline: none;
            transition: border-color 0.2s;
        }
        .qr-url-input:focus {
            border-color: #4caf50;
        }
        .qr-img-preview {
            max-width: 200px;
            max-height: 200px;
            border-radius: 4px;
            margin-top: 12px;
            border: 1px solid #eee;
        }
        .qr-btn-row {
            display: flex;
            gap: 8px;
            margin-top: 16px;
        }
    `;

    // 注入样式
    function injectStyles() {
        if (document.getElementById('qr-userscript-style')) return;
        const style = document.createElement('style');
        style.id = 'qr-userscript-style';
        style.textContent = STYLE;
        document.head.appendChild(style);
    }

    // ==================== 工具函数 ====================

    function isURL(str) {
        const pattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i;
        return pattern.test(str);
    }

    // 移除已存在的弹窗
    function removeExistingModal() {
        const existing = document.getElementById('qr-modal');
        if (existing) existing.remove();
        const overlay = document.getElementById('qr-overlay');
        if (overlay) overlay.remove();
    }

    // 创建弹窗 DOM
    function createModal({ title, contentHTML, onClose, buttons }) {
        removeExistingModal();

        const overlay = document.createElement('div');
        overlay.id = 'qr-overlay';
        overlay.className = 'qr-overlay';
        overlay.addEventListener('click', () => {
            overlay.remove();
            modal.remove();
            if (onClose) onClose();
        });

        const modal = document.createElement('div');
        modal.id = 'qr-modal';
        modal.className = 'qr-modal';

        modal.innerHTML = `
            <div class="qr-modal-header">
                <span class="qr-modal-title">${title || ''}</span>
                <span class="qr-close" id="qr-close-btn">&times;</span>
            </div>
            <div class="qr-content">
                ${contentHTML}
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        // 关闭按钮
        modal.querySelector('#qr-close-btn').addEventListener('click', () => {
            overlay.remove();
            modal.remove();
            if (onClose) onClose();
        });

        // 阻止点击弹窗本身关闭
        modal.addEventListener('click', (e) => e.stopPropagation());

        // 绑定按钮事件
        if (buttons) {
            buttons.forEach(({ id, handler }) => {
                const el = modal.querySelector(`#${id}`);
                if (el) el.addEventListener('click', handler);
            });
        }

        return { overlay, modal };
    }

    // ==================== 生成二维码 ====================

    function generateQRCode() {
        const contentHTML = `
            <div id="qr-code-container"></div>
            <button class="qr-btn" id="qr-regenerate-btn">重新生成</button>
        `;

        const { modal } = createModal({
            title: '网址二维码',
            contentHTML,
            buttons: [
                {
                    id: 'qr-regenerate-btn',
                    handler() {
                        qrcode.clear();
                        qrcode.makeCode(location.href);
                    }
                }
            ]
        });

        const container = modal.querySelector('#qr-code-container');
        const qrcode = new QRCode(container, {
            text: location.href,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // ==================== 解析二维码 ====================

    // 从 canvas 解析二维码
    function decodeCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return jsQR(imageData.data, imageData.width, imageData.height);
    }

    // 从 Image 元素解析二维码
    function decodeFromImage(img) {
        const canvas = document.createElement('canvas');
        try {
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            return decodeCanvas(canvas);
        } finally {
            canvas.width = 0;
            canvas.height = 0;
        }
    }

    // 从 File/Blob 加载为 Image
    function loadImageFromBlob(blob) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('图片加载失败'));
            };
            img.src = url;
        });
    }

    // 显示解析结果
    function showDecodeResult(resultText) {
        const isUrl = isURL(resultText);
        const contentHTML = `
            <textarea class="qr-textarea" rows="4" id="qr-decode-result" readonly>${escapeHTML(resultText)}</textarea>
            <div class="qr-btn-row">
                <button class="qr-btn" id="qr-copy-btn">复制结果</button>
            </div>
            ${isUrl ? `<a class="qr-link" href="${escapeAttr(resultText)}" target="_blank" id="qr-open-link">🔗 打开网址</a>` : ''}
        `;

        createModal({
            title: '解析结果',
            contentHTML,
            buttons: [
                {
                    id: 'qr-copy-btn',
                    async handler() {
                        const textarea = document.getElementById('qr-decode-result');
                        try {
                            await navigator.clipboard.writeText(textarea.value);
                            showToast('已复制到剪贴板');
                        } catch {
                            textarea.select();
                            document.execCommand('copy');
                            showToast('已复制到剪贴板');
                        }
                    }
                }
            ]
        });
    }

    // 解析入口：处理图片并显示结果
    async function processAndDecode(img) {
        try {
            const code = decodeFromImage(img);
            if (code) {
                showDecodeResult(code.data);
            } else {
                showToast('未找到二维码，请确认图片包含清晰的二维码');
            }
        } catch (e) {
            console.error('二维码解析失败:', e);
            showToast('解析失败: ' + e.message);
        }
    }

    // 直接从 canvas 元素解析（无需转图片，避免跨域问题）
    function processCanvasElement(canvas) {
        try {
            const code = decodeCanvas(canvas);
            if (code) {
                showDecodeResult(code.data);
            } else {
                showToast('该 Canvas 上未找到二维码');
            }
        } catch (e) {
            console.error('Canvas 解析失败:', e);
            // tainted canvas 无法读取像素，降级为 toDataURL 方式
            try {
                const dataURL = canvas.toDataURL('image/png');
                const img = new Image();
                img.onload = () => processAndDecode(img);
                img.onerror = () => showToast('Canvas 数据读取失败（跨域限制）');
                img.src = dataURL;
            } catch (e2) {
                showToast('Canvas 受跨域限制，无法读取');
            }
        }
    }

    // 一键扫描页面上所有 Canvas
    function scanAllCanvases() {
        const canvases = document.querySelectorAll('canvas');
        if (canvases.length === 0) {
            showToast('页面上没有找到 Canvas 元素');
            return;
        }
        showToast(`正在扫描 ${canvases.length} 个 Canvas...`, 1200);
        let found = false;
        for (const canvas of canvases) {
            if (canvas.width === 0 || canvas.height === 0) continue;
            try {
                const ctx = canvas.getContext('2d');
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    found = true;
                    showDecodeResult(code.data);
                    break;
                }
            } catch {
                // tainted canvas，跳过
                continue;
            }
        }
        if (!found) {
            showToast('扫描完成，未在 Canvas 上找到二维码');
        }
    }

    // 解析 File 对象
    async function decodeFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            showToast('请选择图片文件');
            return;
        }
        try {
            const img = await loadImageFromBlob(file);
            await processAndDecode(img);
        } catch (e) {
            showToast(e.message);
        }
    }

    // 解析图片 URL（通过 fetch + blob 绕过跨域）
    async function decodeImageURL(url) {
        if (!url) {
            showToast('请输入图片地址');
            return;
        }
        showToast('正在加载图片...');
        try {
            const resp = await fetch(url, { mode: 'cors' });
            if (!resp.ok) throw new Error('加载失败');
            const blob = await resp.blob();
            const img = await loadImageFromBlob(blob);
            await processAndDecode(img);
        } catch (e) {
            console.error('URL加载失败:', e);
            showToast('加载失败，可能是跨域限制');
        }
    }

    // ==================== 解析弹窗（多 Tab） ====================

    function showDecodeModal() {
        const contentHTML = `
            <div class="qr-tab-bar">
                <div class="qr-tab qr-tab-active" data-tab="local">📁 本地图片</div>
                <div class="qr-tab" data-tab="paste">📋 粘贴图片</div>
                <div class="qr-tab" data-tab="url">🔗 图片地址</div>
                <div class="qr-tab" data-tab="page">🎯 页面元素</div>
            </div>

            <!-- Tab 1: 本地上传 -->
            <div class="qr-tab-panel qr-tab-panel-active" data-panel="local">
                <div class="qr-drop-zone" id="qr-drop-zone">
                    <span class="qr-drop-zone-icon">📤</span>
                    <span>点击选择或拖拽图片到此处</span>
                    <span style="font-size:11px;color:#bbb;">支持 PNG / JPG / BMP / GIF</span>
                </div>
                <input type="file" id="qr-file-input" accept="image/*" style="display:none;">
            </div>

            <!-- Tab 2: 粘贴 -->
            <div class="qr-tab-panel" data-panel="paste">
                <div class="qr-drop-zone" id="qr-paste-zone" style="min-height:100px;">
                    <span class="qr-drop-zone-icon">📋</span>
                    <span>点击此处后按 Ctrl+V 粘贴</span>
                    <span style="font-size:11px;color:#bbb;">或直接粘贴截图</span>
                </div>
            </div>

            <!-- Tab 3: URL -->
            <div class="qr-tab-panel" data-panel="url">
                <input type="text" class="qr-url-input" id="qr-url-input" placeholder="输入图片网址 (https://...)">
                <button class="qr-btn qr-btn-secondary" id="qr-url-decode-btn">解析</button>
            </div>

            <!-- Tab 4: 页面元素 -->
            <div class="qr-tab-panel" data-panel="page">
                <div style="text-align:center;color:#666;font-size:13px;padding:8px 0;">
                    <p style="margin:0 0 4px;">点击「选取元素」后，再点击页面上的图片或Canvas</p>
                    <p style="margin:0;font-size:11px;color:#999;">适用于无法下载的图片、Canvas绘制的二维码</p>
                </div>
                <button class="qr-btn qr-btn-secondary" id="qr-page-pick-btn">🎯 选取元素</button>
                <div style="margin-top:12px;text-align:center;">
                    <span style="font-size:11px;color:#bbb;">或</span>
                </div>
                <button class="qr-btn" id="qr-scan-canvas-btn" style="background:#ff9800;margin-top:8px;">🔍 一键扫描Canvas</button>
                <p style="font-size:11px;color:#999;margin-top:4px;">快捷键: <kbd style="background:#eee;border:1px solid #ccc;border-radius:3px;padding:1px 4px;font-size:11px;">Alt</kbd>+<kbd style="background:#eee;border:1px solid #ccc;border-radius:3px;padding:1px 4px;font-size:11px;">Q</kbd></p>
                <p id="qr-canvas-count" style="font-size:11px;color:#999;margin-top:2px;"></p>
            </div>
        `;

        const { modal } = createModal({
            title: '解析二维码',
            contentHTML,
            onClose() {
                cleanupPagePick();
            }
        });

        // ---- Tab 切换 ----
        const tabs = modal.querySelectorAll('.qr-tab');
        const panels = modal.querySelectorAll('.qr-tab-panel');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('qr-tab-active'));
                panels.forEach(p => p.classList.remove('qr-tab-panel-active'));
                tab.classList.add('qr-tab-active');
                modal.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add('qr-tab-panel-active');
            });
        });

        // ---- Tab 1: 本地上传 ----
        const dropZone = modal.querySelector('#qr-drop-zone');
        const fileInput = modal.querySelector('#qr-file-input');

        dropZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', () => {
            if (fileInput.files[0]) decodeFile(fileInput.files[0]);
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('qr-drag-over');
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('qr-drag-over');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('qr-drag-over');
            const file = e.dataTransfer.files[0];
            if (file) decodeFile(file);
        });

        // ---- Tab 2: 粘贴 ----
        const pasteZone = modal.querySelector('#qr-paste-zone');
        pasteZone.setAttribute('tabindex', '0');

        pasteZone.addEventListener('click', () => pasteZone.focus());

        // 监听全局粘贴（弹窗打开时）
        function onPaste(e) {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) decodeFile(file);
                    return;
                }
            }
            showToast('剪贴板中没有图片');
        }
        document.addEventListener('paste', onPaste);
        // 弹窗关闭时移除粘贴监听
        const observer = new MutationObserver(() => {
            if (!document.getElementById('qr-modal')) {
                document.removeEventListener('paste', onPaste);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true });

        // ---- Tab 3: URL ----
        const urlInput = modal.querySelector('#qr-url-input');
        const urlDecodeBtn = modal.querySelector('#qr-url-decode-btn');

        urlDecodeBtn.addEventListener('click', () => decodeImageURL(urlInput.value.trim()));
        urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') decodeImageURL(urlInput.value.trim());
        });

        // ---- Tab 4: 页面元素选取 ----
        const pagePickBtn = modal.querySelector('#qr-page-pick-btn');
        const scanCanvasBtn = modal.querySelector('#qr-scan-canvas-btn');
        const canvasCountEl = modal.querySelector('#qr-canvas-count');
        let pagePickActive = false;

        // 显示页面上 canvas 数量
        const canvasCount = document.querySelectorAll('canvas').length;
        canvasCountEl.textContent = canvasCount > 0
            ? `页面上发现 ${canvasCount} 个 Canvas 元素`
            : '页面上未发现 Canvas 元素';

        // 一键扫描
        scanCanvasBtn.addEventListener('click', () => {
            removeExistingModal();
            scanAllCanvases();
        });

        // 选取元素
        function cleanupPagePick() {
            if (!pagePickActive) return;
            pagePickActive = false;
            const elements = document.querySelectorAll('img, canvas');
            elements.forEach(el => {
                el.classList.remove('qr-highlight');
                el.removeEventListener('click', onElementClick);
                el.removeEventListener('mouseenter', onHighlight);
                el.removeEventListener('mouseleave', onUnhighlight);
            });
            document.removeEventListener('keydown', onEscExit);
        }

        function onHighlight(e) { e.target.classList.add('qr-highlight'); }
        function onUnhighlight(e) { e.target.classList.remove('qr-highlight'); }

        function onEscExit(e) {
            if (e.key === 'Escape') {
                cleanupPagePick();
                showToast('已退出选取模式');
            }
        }

        function onElementClick(e) {
            e.preventDefault();
            e.stopPropagation();
            const el = e.target;
            cleanupPagePick();
            removeExistingModal();

            if (el.tagName === 'CANVAS') {
                processCanvasElement(el);
            } else {
                processAndDecode(el);
            }
        }

        pagePickBtn.addEventListener('click', () => {
            pagePickActive = true;
            removeExistingModal();
            showToast('请点击要解析的图片或 Canvas（按 Esc 退出）', 3000);

            // 同时支持 img 和 canvas
            const elements = document.querySelectorAll('img, canvas');
            elements.forEach(el => {
                el.addEventListener('click', onElementClick, { once: true });
                el.addEventListener('mouseenter', onHighlight);
                el.addEventListener('mouseleave', onUnhighlight);
            });
            document.addEventListener('keydown', onEscExit);
            setTimeout(cleanupPagePick, 30000);
        });
    }

    // HTML 转义
    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function escapeAttr(str) {
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // 轻提示
    function showToast(msg, duration = 2000) {
        const existing = document.querySelector('.qr-hint');
        if (existing) existing.remove();

        const hint = document.createElement('div');
        hint.className = 'qr-hint';
        hint.textContent = msg;
        document.body.appendChild(hint);
        setTimeout(() => hint.remove(), duration);
    }

    // ==================== 菜单注册 ====================

    injectStyles();

    GM_registerMenuCommand('生成二维码', generateQRCode, 'qrcodeGenerate');
    GM_registerMenuCommand('解析二维码', showDecodeModal, 'decodeQRImg');

    // ==================== 快捷键 & 页面提示 ====================
    const HOTKEY = { ctrl: false, shift: false, alt: true, key: 'KeyQ' }; // Alt+Q
    const HOTKEY_LABEL = 'Alt+Q';

    // 快捷键监听：一键扫描 Canvas
    document.addEventListener('keydown', (e) => {
        if (e.altKey && !e.ctrlKey && !e.shiftKey && e.code === HOTKEY.key) {
            e.preventDefault();
            scanAllCanvases();
        }
    });

    // 页面右下角常驻提示
    function showShortcutTip() {
        if (document.getElementById('qr-shortcut-tip')) return;
        const tip = document.createElement('div');
        tip.id = 'qr-shortcut-tip';
        tip.className = 'qr-shortcut-tip';
        tip.innerHTML = `📷 扫描Canvas: <kbd>${HOTKEY_LABEL}</kbd>`;
        tip.title = '点击也可扫描页面上的Canvas二维码';
        tip.addEventListener('click', () => scanAllCanvases());
        document.body.appendChild(tip);
    }

    showShortcutTip();

})();
