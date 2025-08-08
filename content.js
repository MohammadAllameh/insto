(function () {
    let isExtensionActive = true;

    // Function to manage video playback and PiP
    function manageVideoPlayback() {
        if (!isExtensionActive) return;

        const videos = document.querySelectorAll("video");
        videos.forEach((video) => {
            // Ensure PiP is enabled
            video.disablePictureInPicture = false;

            // Monitor pause events and resume in PiP
            video.addEventListener("pause", () => {
                if (document.hidden || document.pictureInPictureElement) {
                    video
                        .play()
                        .catch((error) =>
                            console.error("Error resuming video:", error)
                        );
                }
            });

            // Enter PiP when tab is hidden
            document.addEventListener("visibilitychange", () => {
                if (
                    document.hidden &&
                    video.readyState >= 2 &&
                    !document.pictureInPictureElement
                ) {
                    video.requestPictureInPicture().catch((error) => {
                        console.error("Error entering PiP:", error);
                    });
                }
            });

            // Polling to ensure continuous playback in PiP
            const checkPlayback = setInterval(() => {
                if (
                    document.pictureInPictureElement === video &&
                    video.paused
                ) {
                    video
                        .play()
                        .catch((error) =>
                            console.error("Error resuming PiP video:", error)
                        );
                }
            }, 1000);

            // Clean up interval when video is removed
            video.addEventListener("unload", () =>
                clearInterval(checkPlayback)
            );
        });
    }

    // Run immediately
    manageVideoPlayback();

    // Observe DOM changes for dynamically loaded videos
    const observer = new MutationObserver(() => {
        manageVideoPlayback();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Listen for toggle messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "toggleExtension") {
            isExtensionActive = request.state;
            if (!isExtensionActive && document.pictureInPictureElement) {
                document
                    .exitPictureInPicture()
                    .catch((error) =>
                        console.error("Error exiting PiP:", error)
                    );
            }
            sendResponse({ status: "toggled", state: isExtensionActive });
        }
    });
})();
