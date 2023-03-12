// リーダーモードを自動的に有効にするかどうかのフラグ
let isReadModeEnabled = false;

// タブがアクティブになった時のイベントハンドラ
chrome.tabs.onActivated.addListener((activeInfo) => {
    // リーダーモードが有効でない場合は何もしない
    if (!isReadModeEnabled) {
        return;
    }

    // アクティブなタブを取得し、URLが http:// もしくは https:// で始まる場合にリーダーモードで開く
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
            const readerModeUrl = `read:${tab.url}`;
            chrome.tabs.update(activeInfo.tabId, { url: readerModeUrl });
        }
    });
});

// popupからチェックボックスの値を受け取り、リーダーモードを切り替える
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 自動リーダーモードの有効/無効を切り替える
    isReadModeEnabled = request.autoReaderMode;
    if (request.autoReaderMode !== undefined) {
        // auto reader modeの設定があれば保存する
        chrome.storage.local.set({ "autoReaderMode": request.autoReaderMode });
    }
});

// リーダーモードの有効/無効を読み込む
chrome.storage.local.get("autoReaderMode", (result) => {
    const autoReaderMode = result.autoReaderMode;
    // 設定が存在する場合には、それに従って処理を行う
    if (autoReaderMode) {
        isReadModeEnabled = true; // リーダーモードを有効化
    }
});
