function calculateAngle(A, B, C) {
    const radians = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180) {
        angle = 360 - angle;
    }
    return angle;
}

function onPoseResults(results) {
    const canvasElement = document.getElementById('outputCanvas');
    const canvasCtx = canvasElement.getContext('2d');

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasElement.width = results.image.width;
    canvasElement.height = results.image.height;

    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            { color: '#00FF00', lineWidth: 4 });
        drawLandmarks(canvasCtx, results.poseLandmarks,
            { color: '#FF0000', lineWidth: 2 });

        updateSquatCounter(results.poseLandmarks);
        updateBicepCurlCounter(results.poseLandmarks);
    }
}
