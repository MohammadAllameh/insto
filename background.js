chrome.runtime.onInstalled.addListener(() => {
    console.log("Insto extension installed.");
});

// Listen for tab updates to check for Instagram
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url.includes("instagram.com")) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: checkAndEnablePiP,
            });
        }
    });
});

function checkAndEnablePiP() {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
        if (!video.disablePictureInPicture) {
            video
                .requestPictureInPicture()
                .catch((error) => console.error("Error entering PiP:", error));
        }
    });
}
