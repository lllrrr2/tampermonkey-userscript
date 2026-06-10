// ==UserScript==
// @name         百度题库显示答案
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  百度题库显示答案。
// @author       夜雨
// @match        https://easylearn.baidu.com/*
// @match        https://tiku.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=easylearn.baidu.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // 设置答案区域字体大小
    const style = document.createElement('style');
    style.textContent = '#analysis { font-size: 14px !important; }';
    document.head.appendChild(style);

    const clearMask = function () {
        if (document.querySelector(".mask")) {
            document.querySelectorAll(".mask").forEach(e => {
                e.remove();
            })
        }
        if (document.querySelector(".guid-to-app-mask")) {
            document.querySelectorAll(".guid-to-app-mask").forEach(e => {
                e.remove();
            })
        }
        // 移除遮罩class属性（不删除元素）
        document.querySelectorAll(".analysis-text-mask").forEach(e => {
            e.classList.remove("analysis-text-mask");
        })
        document.querySelectorAll(".shiti-answer").forEach(e => {
            e.classList.remove("shiti-answer");
        })
        console.log("清理完毕")

    }

    setTimeout(clearMask, 3000)

    // Your code here...
})();

