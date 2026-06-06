// ==UserScript==
// @name         手机浏览器console控制台加载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  能让手机浏览器的像电脑脑F12一样调试代码，查看console控制台信息，查看网页源码，js调试等。
// @description:en  load the web page console to debug or get some information etc.
// @author       夜雨
// @match        http://*/*
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const ERUDA_CDN = 'https://s4.zstatic.net/ajax/libs/eruda/3.4.3/eruda.min.js';
    const ERUDA_ID = 'eruda-console-script';

    let erudaLoaded = false;

    // 动态加载 eruda
    function loadEruda() {
        return new Promise((resolve, reject) => {
            if (erudaLoaded && typeof eruda !== 'undefined') {
                resolve();
                return;
            }
            if (document.getElementById(ERUDA_ID)) {
                // script 已插入但可能还在加载
                const check = setInterval(() => {
                    if (typeof eruda !== 'undefined') {
                        clearInterval(check);
                        erudaLoaded = true;
                        resolve();
                    }
                }, 100);
                setTimeout(() => { clearInterval(check); reject(new Error('加载超时')); }, 10000);
                return;
            }
            const script = document.createElement('script');
            script.id = ERUDA_ID;
            script.src = ERUDA_CDN;
            script.onload = () => { erudaLoaded = true; resolve(); };
            script.onerror = () => reject(new Error('Eruda 加载失败'));
            document.head.appendChild(script);
        });
    }

    // 初始化 eruda
    function initEruda() {
        eruda.init({
            useShadowDom: true,
            autoScale: true,
            defaults: {
                displaySize: 40,
                transparency: 0.9
            }
        });
    }

    // 切换开关
    async function toggleEruda() {
        if (erudaLoaded && typeof eruda !== 'undefined' && eruda._isShow) {
            eruda.destroy();
            erudaLoaded = false;
            return;
        }
        try {
            await loadEruda();
            initEruda();
        } catch (e) {
            console.error('[Eruda]', e.message);
            alert('Eruda 加载失败，请检查网络');
        }
    }

    // 注册菜单
    GM_registerMenuCommand('打开/关闭控制台', toggleEruda, 'openEruda');

})();
