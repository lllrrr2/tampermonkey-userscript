const Obj = {
    toString: (text: any): string => {
    }
}
/**
 * CryptoJS
 */
const CryptoJS = {
    SHA256: (text): Obj => {
    },
    enc: {
        Hex: 'hex'
    }
}
/**
 * katex
 */
const katex = {
    renderToString: (text: string, options: any): string => {
    }
}
/**
 * hljs
 */
const hljs = {
    highlightElement:(el: HTMLElement): void => {},
    configure:(el: any): void => {},
}


/**
 * jquery
 */
function $(selector: string): HTMLElement;

/**
 * 发送人信息
 * @param type 类型
 * @returns
 */
function handleUserInput(type: int): () => void;

/**
 * 机器人信息
 * @param str 信息
 * @returns
 */
function simulateBotResponse(str: string): () => void;


/**
 * 填充机器人信息，先@simulateBotResponse创建
 * @param str 信息
 * @returns
 */
function fillBotResponse(str: string): () => void;

/**
 * 保存问题答案
 * @param question 问题
 * @param answer 答案
 * @returns
 */
function saveHistory(question: string, answer: string): () => void;

