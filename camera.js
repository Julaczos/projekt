async function startCamera() {
    const video = document.createElement("video");  // Tworzymy element wideo, ale go nie wyświetlamy
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();
        return video;
    } catch (err) {
        console.error("Błąd podczas uzyskiwania dostępu do kamerki: ", err);
        alert("Nie można uzyskać dostępu do kamery. Upewnij się, że udzielono odpowiednich uprawnień.");
    }
}

async function initMediaPipe(video) {
    const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
        modelComplexity: 0,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    pose.onResults(onPoseResults);

    async function detectPose() {
        if (video.readyState >= 3) {
            await pose.send({ image: video });
        }
        requestAnimationFrame(detectPose);
    }

    detectPose();
}
