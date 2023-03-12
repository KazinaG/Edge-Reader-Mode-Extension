// 次の関数は、与えられたタブをリーダーモードに切り替える機能を持ちます。
function toggleReaderMode(tab) {
    const { url } = tab;
    let readerModeUrl = url;

    // read:で始まるURLがあればデコード、そうでなければ文字列の先頭に 'read:' をつけて変更
    if (url.startsWith("read:")) {
        readerModeUrl = decodeURIComponent(url.split("?url=")[1]);
    } else if (url.startsWith("https://") || url.startsWith("http://")) {
        readerModeUrl = `read:${tab.url}`;
    }

    // タブのURLを更新して閉じる
    chrome.tabs.update(tab.id, { url: readerModeUrl });
    window.close();
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggle");
    const autoReaderModeCheckbox = document.getElementById("auto-reader-mode");

    // アクティブなタブを取得し、そのタブのURLに応じてトグルボタンを有効/無効化する。
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        const { url } = tab;
        toggleButton.disabled = !(
            url.startsWith("read:") || url.startsWith("https://") || url.startsWith("http://")
        );
        // トグルボタンがクリックされたときに現在アクティブなタブを参照し、リーダーモードに切り替える。
        toggleButton.addEventListener("click", () => toggleReaderMode(tab));
    });

    // 自動リーダーモードのチェックボックスが変更された場合、バックグラウンドスクリプトにメッセージを送信する。
    autoReaderModeCheckbox.addEventListener("change", () => {
        chrome.runtime.sendMessage({ autoReaderMode: autoReaderModeCheckbox.checked });
    });

    // ユーザーの設定に従って自動リーダーモードのチェックボックスを更新する。
    chrome.storage.local.get({ autoReaderMode: false }, ({ autoReaderMode }) => {
        autoReaderModeCheckbox.checked = autoReaderMode;
    });
});