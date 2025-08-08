let isExtensionActive = true;

document.getElementById("toggleBtn").addEventListener("click", () => {
    isExtensionActive = !isExtensionActive;
    const button = document.getElementById("toggleBtn");
    button.textContent = isExtensionActive ? "On" : "Off";
    button.classList.toggle("on", isExtensionActive);
    button.classList.toggle("off", !isExtensionActive);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].url.includes("instagram.com")) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: notifyContentScript,
                args: [isExtensionActive],
            });
        }
    });
});

function notifyContentScript(state) {
    chrome.runtime.sendMessage({ action: "toggleExtension", state: state });
}

// Initialize button state
chrome.storage.local.get("extensionState", (data) => {
    isExtensionActive = data.extensionState !== false;
    const button = document.getElementById("toggleBtn");
    button.textContent = isExtensionActive ? "On" : "Off";
    button.classList.toggle("on", isExtensionActive);
    button.classList.toggle("off", !isExtensionActive);
});
