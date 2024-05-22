/**
 * 访问window对象，使用油猴API时window对象是沙盒内的window对象，只能通过unsafeWindow访问页面window对象
 */
const unsafeWindow: Window;

/**
 * 添加样式到页面中
 * @param style 样式
 * @returns 添加后的style元素
 */
function GM_addStyle(style: string): HTMLElement;

/**
 * 添加元素到head中
 * @param tag_name 标签名称
 * @param attributes 属性
 * @returns 添加的元素
 */
function GM_addElement(tag_name: string, attributes?: object): HTMLElement;
/**
 * 添加元素到指定元素中
 * @param parent_node 父元素
 * @param tag_name 标签名称
 * @param attributes 属性
 * @returns 添加的元素
 */
function GM_addElement(parent_node: HTMLElement, tag_name: string, attributes?: object): HTMLElement;

/**
 * 设置值
 * @param name 键
 * @param value 值
 */
 function GM_setValue(name: string, value: any): void;
 /**
  * 获取值
  * @param name 键
  * @param defaultValue 默认值
  * @returns 值
  */
 function GM_getValue(name: string, defaultValue?: any): any;
/**
 * 删除值
 * @param name 键
 */
function GM_deleteValue(name: string): void;
/**
 * 获取键列表
 * @returns 键数组
 */
function GM_listValues(): string[];
/**
 * 添加值变化监听器
 * @param name 键
 * @param callback 回调函数
 * @returns 监听器ID
 */
function GM_addValueChangeListener(name: string, 
    callback: (
        /** 键 */
        name: string,
        /** 旧值 */
        old_value: any,
        /** 新值 */
        new_value: any,
        /** 该值是否是被其它选项卡中的脚本实例修改 */
        remote: boolean
    ) => void
): number;
/**
 * 移除值变化监听器
 * @param listener_id 监听器ID
 */
function GM_removeValueChangeListener(listener_id: number): void;

/**
 * 打印内容
 * @param message 内容
 */
function GM_log(message: string): void;

/**
 * 获取资源的文本内容
 * @param name 资源名称
 * @returns 文本内容
 */
function GM_getResourceText(name: string): string | null;
/**
 * 获取资源的内容base64编码后的结果
 * @param name 资源名称
 * @returns data:type;base64,值
 */
function GM_getResourceURL(name: string): string | null;

/**
 * 注册一个菜单，在运行此脚本页面的tampermonkey菜单中显示。
 * 前提是插件的run-at要设置为 context-menu，否则不会出现菜单
 * @param name 菜单显示名称
 * @param fn 单击菜单的事件
 * @param accessKey 访问键（好像没用）
 * @returns 菜单ID
 */
function GM_registerMenuCommand(name: string, fn: Function, accessKey: string): number;
/**
 * 取消注册一个菜单
 * @param menuCmdId 菜单ID
 */
function GM_unregisterMenuCommand(menuCmdId: number): void;

/**
 * 获取当前选项卡的tab对象，只要选项卡没有被关闭，那么这个对象就是持久的
 * @param 回调，参数是tab对象，默认是空对象
 */
function GM_getTab(callback: (tab: object) => void): void;

/**
 * 保存选项卡对象，以便在页面关闭后重新打开时加载（就随便填一个普通对象，或者自己的tab对象都可以）
 * getTab获取的是saveTab后的内容
 * @param tab 
 */
function GM_saveTab(tab: object): void
/**
 * 获取所有选项卡对象，以便与其它脚本实例进行通信
 * @param callback 回调，参数是普通对象，每个属性是一个实例（只会获取到存活的选项卡tab对象）
 */
function GM_getTabs(callback: (tabs: object) => void): void;

type GMOepnInTabOptions = {
    /** 聚焦，切换到该选项卡 */
    active?: boolean,
    /** 在当前选项卡之后插入新选项卡，而不是添加到所有选项卡末尾 */
    insert?: boolean,
    /** 使浏览器将当前选项卡重新聚焦在关闭和关闭位置 */
    setParent?: boolean,
    /** 在隐匿模式下打开该标签页 */
    incognito?: boolean
}
type GMOpenInTabResult = {
    /** 关闭选项卡 */
    close: () => void;
    /** 选项卡是否已关闭  */
    closed: boolean,
    /** 选项卡名称 */
    name: string | undefined | null,
    /** 选项卡关闭时触发 */
    onclose: Function | null
}

/**
 * 打开新的选项卡
 * @param url 地址
 * @param options 属性
 */
function GM_openInTab(url: string, options: GMOepnInTabOptions): GMOpenInTabResult;
/**
 * 打开新的选项卡
 * @param url 地址
 * @param loadInBackground 与options的active相反，是否不聚焦
 */
function GM_openInTab(url: string, loadInBackground: boolean): GMOpenInTabResult;


/**
 * 将数据复制到剪贴板
 * @param data 数据
 * @param info 信息，可以是 {type: 内容类型, mimetype: 内容mime类型} 或者 内容类型
 */
function GM_setClipboard(data: any, info: { type?: string, mimetype?: string } | string): void;


type GMNotificationOptions = {
    /** 通知的文本，除非设置了highlight，否则为必填项 */
    text?: string,
    /** 标题 */
    title?: string,
    /** 图像 */
    image?: unknown,
    /** 是否突出显示发送通知的选项卡，除非设置了text，否则为必填项 */
    highlight?: boolean,
    /** 静音 */
    slient?: boolean,
    /** 超时被隐藏时间，0=禁用 */
    timeout?: number,
    /** 通知关闭时调用，无论是超时、单击触发、关闭选项卡 */
    ondone?: Function,
    /** 单击通知时调用 */
    onclick?: Function
}
/**
 * 显示桌面通知
 * @param details 详细信息
 * @param ondone 通知关闭时调用，无论是超时、单击触发、关闭选项卡
 */
function GM_notification(details: GMNotificationOptions, ondone: Function): void;
/**
 * 显示桌面通知
 * @param text 通知的文本
 * @param title 标题
 * @param image 图像
 * @param onclick 单击通知时调用
 */
function GM_notification(text: string, title: string, image: unknown, onclick: Function): void;

/**
 * 脚本信息
 */
const GM_info: {
    downloadMode: string,
    isFirstPartyIsolation: unknown,
    isIncognito: boolean,
    script: {
        antifeatures: object,
        author: string | null,
        blockers: unknown[],
        copyright: string | null,
        description: string | null,
        description_i18n: object,
        downloadURL: string | null,
        evilness: number,
        excludes: string[],
        grant: string[],
        header: string,
        homepage: string | null,
        icon: string | null,
        icon64: string | null,
        includes: string[],
        lastModified: number,
        matches: string[],
        name: string | null,
        name_i18n: object,
        namespace: string | null,
        options: {
            check_for_updates: boolean,
            comment: unknown | null,
            compat_foreach: boolean,
            compat_metadata: boolean,
            compat_prototypes: boolean,
            compat_wrappedjsobject: boolean,
            compatopts_for_requires: boolean,
            noframes: unknown | null,
            override: {
                merge_connects: boolean,
                merge_excludes: boolean,
                merge_includes: boolean,
                merge_matches: boolean,
                orig_connects: string[],
                orig_excludes: string[],
                orig_includes: string[],
                orig_matches: string[],
                orig_noframes: unknown | null,
                orig_run_at: 'document-start' | 'document-body' | 'document-end' | 'document-idle',
                use_blockers: unknown[],
                use_connects: unknown[],
                use_excludes: unknown[],
                use_includes: unknown[],
                use_matches: unknown[],
            },
            run_at: 'document-start' | 'document-body' | 'document-end' | 'document-idle' | 'context-menu',
        },
        position: number,
        resources: unknown[],
        'run-at': 'document-start' | 'document-body' | 'document-end' | 'document-idle' | 'context-menu',
        supportURL: unknown | null,
        sync: {
            imported: boolean
        },
        unwrap: boolean,
        updateURL: string | null,
        uuid: string | null,
        version: string | null,
        webRequest: unknown[]
    },
    scriptHandler: string | null,
    scriptMetaStr: string | null,
    scriptSource: string | null,
    scriptUpdateURL: string | undefined | null,
    scriptWillUpdate: boolean,
    toString: () => string,
    version: string | null
}

// [T] 标记：类型可能不准确

type GMXMLHttpRequestOptionsOnloadArg0 = {
    /** 从加载数据的所有重定向后的最终 URL */
    finalUrl: string,
    /** 就绪状态 */
    readyState: number,
    /** 请求状态 */
    status: number,
    /** 请求状态文本 */
    statusText: string,
    /** 请求响应标头 */
    responseHeaders: object,
    /** 如果设置了responseType，那么此处的类型则为预先设置的类型 */
    response: any,
    /** 作为 XML 文档的响应数据 */
    responseXML: any,
    /** 纯字符串形式的响应数据 */
    responseText: string
}

type GMXMLHttpRequestOptions = {
    method: 'GET' | 'HEAD' | 'POST',
    url: string,
    headers?: object,
    /** 通过POST请求发送的字符串 */
    data?: string,
    /** 携带的cookie */
    cookie?: object,
    /** 以二进制模式发送data字符串 [T] */
    binary?: boolean,
    /** 不缓存资源 */
    nocache?: boolean,
    /** 重新验证可能缓存的内容 [T] */
    revalidate?: boolean,
    /** 超时时间（毫秒） */
    timeout?: number
    /** 添加到响应对象的属性 */
    context?: any,
    /** 指定响应数据的类型 */
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'stream',
    /** 请求的MIME类型 */
    overrideMimeType?: string,
    /** 不跟随请求发送cookie */
    anonymous?: boolean,
    /** 使用fetch而不是xhr请求（beta），请查阅官方说明：https://www.tampermonkey.net/documentation.php#GM_xmlhttpRequest */
    fetch?: boolean,
    /** 用于身份验证的用户名 */
    user?: string,
    /** 用于身份验证的密码 */
    password?: string,
    /** 请求终止回调 */
    onabort: Function,
    /** 如果请求出现错误，要执行的回调 */
    onerror: Function,
    /** 在加载开始时执行的回调，如果 responseType 设置为"stream"，则提供对流对象的访问 */
    onloadstart: Function,
    /** 如果请求取得了一些进展，则要执行的回调 */
    onprogress: Function,
    /** 在请求的就绪状态发生更改时要执行的回调 */
    onreadystatechange: Function,
    /** 如果请求由于超时而失败，则要执行的回调 */
    ontimeout: Function,
    /** 如果加载了请求，则要执行的回调 */
    onload: (e: GMXMLHttpRequestOptionsOnloadArg0) => void
}

/**
 * 通过XMLHttpRequest发送一个请求
 * @param details 详细信息
 * @returns 该函数终止此次请求
 */
function GM_xmlhttpRequest(details: GMXMLHttpRequestOptions): () => void;