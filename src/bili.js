// ==UserScript==
// @name         B站视频调速
// @namespace    yeyu
// @version      1.0
// @description  bilibili视频调速，突破2倍速，滑块无极变速
// @author       夜雨
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://nnyy.in/dianying/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        /* 右侧贴边按钮 */
        .bili-rate-side {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            z-index: 99999;
            display: flex;
            align-items: center;
        }
        .bili-rate-btn-main {
            writing-mode: vertical-lr;
            height: auto;
            padding: 10px 5px;
            border-radius: 4px 0 0 4px;
            background: rgba(0, 0, 0, 0.25);
            color: rgba(255, 255, 255, 0.7);
            border: none;
            cursor: pointer;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 2px;
            transition: all 0.2s;
        }
        .bili-rate-btn-main:hover {
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
        }
        .bili-rate-btn-main.bili-rate-modified {
            color: #00a1d6;
        }

        /* 展开面板 - 向左弹出 */
        .bili-rate-popup {
            position: absolute;
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(20, 20, 20, 0.75);
            border-radius: 8px;
            padding: 14px 16px;
            min-width: 240px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(12px);
            display: none;
            margin-right: 4px;
        }
        .bili-rate-popup.bili-rate-show {
            display: block;
            animation: bili-rate-slideIn 0.15s ease;
        }
        @keyframes bili-rate-slideIn {
            from { opacity: 0; transform: translateY(-50%) translateX(8px); }
            to { opacity: 1; transform: translateY(-50%) translateX(0); }
        }

        .bili-rate-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .bili-rate-val {
            color: rgba(255, 255, 255, 0.9);
            font-size: 13px;
            font-weight: 600;
            min-width: 48px;
            text-align: center;
            white-space: nowrap;
            cursor: pointer;
            transition: color 0.2s;
        }
        .bili-rate-val:hover {
            color: #00a1d6;
        }
        .bili-rate-slider {
            flex: 1;
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            border-radius: 2px;
            background: linear-gradient(to right, #00a1d6 0%, #00a1d6 var(--progress, 6.25%), #444 var(--progress, 6.25%), #444 100%);
            outline: none;
            cursor: pointer;
        }
        .bili-rate-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #00a1d6;
            cursor: pointer;
            box-shadow: 0 0 6px rgba(0, 161, 214, 0.5);
            transition: transform 0.15s;
        }
        .bili-rate-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }
        .bili-rate-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #00a1d6;
            cursor: pointer;
            border: none;
        }

        .bili-rate-presets {
            display: flex;
            gap: 5px;
            margin-top: 10px;
            flex-wrap: wrap;
        }
        .bili-rate-p {
            padding: 3px 10px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.06);
            color: rgba(255, 255, 255, 0.7);
            border: none;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }
        .bili-rate-p:hover {
            background: rgba(255, 255, 255, 0.12);
            color: #fff;
        }
        .bili-rate-p.bili-rate-active {
            background: #00a1d6;
            color: #fff;
        }
        .bili-rate-hint {
            color: rgba(255, 255, 255, 0.3);
            font-size: 10px;
            margin-top: 8px;
            text-align: center;
        }

        /* 播放器控制栏隐藏时，按钮也半透明 */
        .bili-rate-side.bili-rate-dim {
            opacity: 0.15;
            transition: opacity 0.3s;
        }
        .bili-rate-side.bili-rate-dim:hover {
            opacity: 1;
        }

        /* 鼠标离开播放器时隐藏 */
        .bili-rate-side.bili-rate-hidden {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
    `);

    // ==================== 获取视频 ====================

    function getVideo() {
        return document.querySelector('.bpx-player-video-wrap video')
            || document.querySelector('.bwp-video video')
            || document.querySelector('.bilibili-player-video-video video')
            || document.querySelector('video');
    }

    // ==================== 创建控件 ====================

    const PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5];
    let injected = false;

    function inject() {
        if (injected) return;
        if (!getVideo()) return;

        // 找到播放器容器
        const player = document.querySelector('.bpx-player-container')
            || document.querySelector('.bilibili-player-video-wrap')
            || document.querySelector('.player-wrap')
            || document.querySelector('#player_module')
            || getVideo().closest('[class*="player"]');
        if (!player) return;

        player.style.position = 'relative';
        injected = true;

        const currentRate = getVideo().playbackRate || 1;

        // ---- 右侧贴边容器 ----
        const side = document.createElement('div');
        side.className = 'bili-rate-side';

        // ---- 按钮 ----
        const btn = document.createElement('button');
        btn.className = 'bili-rate-btn-main';
        btn.textContent = currentRate === 1 ? '倍速' : currentRate.toFixed(2) + 'x';
        if (currentRate !== 1) btn.classList.add('bili-rate-modified');
        btn.title = '视频调速';

        // ---- 展开面板 ----
        const popup = document.createElement('div');
        popup.className = 'bili-rate-popup';
        popup.innerHTML = `
            <div class="bili-rate-row">
                <span class="bili-rate-val" id="bili-rate-val" title="点击重置为 1x">${currentRate.toFixed(2)}x</span>
                <input type="range" class="bili-rate-slider" id="bili-rate-slider"
                    min="0.1" max="16" step="0.01" value="${currentRate}"
                    style="--progress: ${(currentRate / 16 * 100).toFixed(1)}%">
            </div>
            <div class="bili-rate-presets" id="bili-rate-presets">
                ${PRESETS.map(r => `<button class="bili-rate-p${Math.abs(r - currentRate) < 0.01 ? ' bili-rate-active' : ''}" data-rate="${r}">${r}x</button>`).join('')}
            </div>
            <div class="bili-rate-hint">点击速度数值重置为 1x</div>
        `;

        side.appendChild(popup);
        side.appendChild(btn);
        player.appendChild(side);

        // ---- 默认隐藏 ----
        side.classList.add('bili-rate-hidden');

        // ---- 鼠标进入/离开播放器 ----
        let hideTimer = null;

        player.addEventListener('mouseenter', () => {
            clearTimeout(hideTimer);
            side.classList.remove('bili-rate-hidden');
        });

        player.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(() => {
                // 关闭弹窗
                popup.classList.remove('bili-rate-show');
                side.classList.add('bili-rate-hidden');
            }, 300);
        });

        // 鼠标在侧边栏上时不隐藏
        side.addEventListener('mouseenter', () => {
            clearTimeout(hideTimer);
        });

        side.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(() => {
                popup.classList.remove('bili-rate-show');
                side.classList.add('bili-rate-hidden');
            }, 300);
        });

        // ---- 控制栏隐藏时按钮半透明 ----
        const controlBar = document.querySelector('.bpx-player-control-bottom')
            || document.querySelector('.bilibili-player-video-control');
        if (controlBar) {
            const barObserver = new MutationObserver(() => {
                const hidden = controlBar.style.opacity === '0'
                    || getComputedStyle(controlBar).opacity === '0'
                    || controlBar.classList.contains('bpx-player-hide');
                side.classList.toggle('bili-rate-dim', hidden);
            });
            barObserver.observe(controlBar, { attributes: true, attributeFilter: ['style', 'class'] });
        }

        // ---- 事件 ----
        const slider = popup.querySelector('#bili-rate-slider');
        const label = popup.querySelector('#bili-rate-val');
        const presets = popup.querySelector('#bili-rate-presets');

        function applyRate(rate) {
            const video = getVideo();
            if (!video) return;
            video.playbackRate = rate;
            label.textContent = rate.toFixed(2) + 'x';
            slider.value = rate;
            slider.style.setProperty('--progress', (rate / 16 * 100).toFixed(1) + '%');
            btn.textContent = rate === 1 ? '倍速' : rate.toFixed(2) + 'x';
            btn.classList.toggle('bili-rate-modified', rate !== 1);
            presets.querySelectorAll('.bili-rate-p').forEach(b => {
                const r = parseFloat(b.dataset.rate);
                b.classList.toggle('bili-rate-active', Math.abs(r - rate) < 0.05);
            });
        }

        // 点击按钮 → 展开/收起
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.classList.toggle('bili-rate-show');
        });

        // 滑块无极变速
        slider.addEventListener('input', () => applyRate(parseFloat(slider.value)));

        // 预设按钮
        presets.addEventListener('click', (e) => {
            const b = e.target.closest('.bili-rate-p');
            if (!b) return;
            applyRate(parseFloat(b.dataset.rate));
        });

        // 点击速度标签重置为 1x
        label.addEventListener('click', () => applyRate(1));

        // 点击外部关闭面板
        document.addEventListener('click', (e) => {
            if (!side.contains(e.target)) {
                popup.classList.remove('bili-rate-show');
            }
        });

        // Esc 关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') popup.classList.remove('bili-rate-show');
        });
    }

    // ==================== 等待播放器加载 ====================

    function waitForPlayer() {
        inject();
        if (injected) return;

        const observer = new MutationObserver(() => {
            inject();
            if (injected) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 15000);
    }

    if (document.readyState === 'complete') {
        waitForPlayer();
    } else {
        window.addEventListener('load', waitForPlayer);
    }

})();
