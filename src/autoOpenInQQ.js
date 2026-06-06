// ==UserScript==
// @name         QQ链接自动打开
// @namespace    http://yeyu1024.xyz
// @version      2.7
// @description  PC上使用QQ、QQ邮箱，微云文档点开链接，浏览器提示非QQ官方链接页面时自动打开对应的链接。另外支持CSDN，简书，贴吧，微博，酷安，知乎，nodeseek
// @author       夜雨
// @match        *://c.pc.qq.com/*
// @match        *://weixin110.qq.com/cgi-bin/*
// @match        *://link.zhihu.com/*
// @match        *://mail.qq.com/cgi-bin/*
// @match        *://wx.mail.qq.com/xmspamcheck/*
// @match        *://*.bdimg.com/safecheck/*
// @match        *://t.cn/*
// @match        *://*.coolapk.com/link*
// @match        *://*.jianshu.com/go-wild*
// @match        *://link.csdn.net/*
// @match        *://link.juejin.cn/*
// @match        *://google.urlshare.cn/umirror_url_check*
// @match        *://www.nodeseek.com/jump?to=*
// @icon         https://mat1.gtimg.com/www/icon/favicon2.ico
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    const url = location.href;
    const params = new URLSearchParams(location.search);

    // 从 URL 参数获取链接
    function getParam(name) {
        const val = params.get(name);
        return val ? decodeURIComponent(val) : '';
    }

    // 安全获取元素文本
    function getText(selector) {
        const el = document.querySelector(selector);
        return el ? el.innerText.trim() : '';
    }

    // 安全点击元素
    function clickEl(selector) {
        const el = document.querySelector(selector);
        if (el) el.click();
    }

    // 跳转
    function openUrl(link) {
        if (!link) return;
        console.log('[自动打开]', link);
        location.href = link.startsWith('http') ? link : `http://${link}`;
    }

    // ========== 各平台处理 ==========

    // QQ PC 安全链接
    if (url.includes('c.pc.qq.com')) {
        const link = getParam('pfurl') || getParam('url') || getText('div.safety-url');
        openUrl(link);
        return;
    }

    // 掘金
    if (url.includes('link.juejin.cn')) {
        const link = getParam('target');
        if (link) {
            openUrl(link);
        } else {
            clickEl('.link-container + *');
        }
        return;
    }

    // 百度安全检查
    if (url.includes('bdimg.com')) {
        clickEl('a.btn.btn-next');
        return;
    }

    // 微博短链
    if (url.includes('t.cn')) {
        clickEl('.open-url a');
        return;
    }

    // 酷安
    if (url.includes('coolapk.com/link')) {
        openUrl(getParam('url'));
        return;
    }

    // 知乎
    if (url.includes('zhihu.com')) {
        openUrl(getParam('target'));
        return;
    }

    // 简书
    if (url.includes('jianshu.com')) {
        openUrl(getParam('url'));
        return;
    }

    // CSDN
    if (url.includes('link.csdn.net')) {
        openUrl(getParam('target'));
        return;
    }

    // 微云文档
    if (url.includes('google.urlshare.cn')) {
        openUrl(getParam('url'));
        return;
    }

    // NodeSeek
    if (url.includes('nodeseek.com/jump')) {
        openUrl(getParam('to'));
        return;
    }

    // 微信安全链接
    if (url.includes('weixin110')) {
        openUrl(getText('.weui-msg__desc'));
        return;
    }

    // QQ 邮箱
    if (url.includes('mail.qq.com')) {
        // 优先尝试页面内置跳转函数
        try { goUrl(1); } catch {}
        // 尝试点击授权按钮
        clickEl('#accessBtn');
        // 兜底：提取链接文本
        const link = getText('div.safety-url') || getText('.content__url') || getParam('url');
        if (link) openUrl(link);
        return;
    }

})();
