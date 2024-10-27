let squatCount = 0;
let isSquatting = false;
let bicepCurlCount = 0;
let isCurling = false;

let level = 1;
let xp = 0;
let xpToNextLevel = 100;
let currentLocation = 'MainMap';

let videoStream;
let pose;

window.squatCount = squatCount;
window.bicepCurlCount = bicepCurlCount;
window.level = level;
window.xp = xp;
window.xpToNextLevel = xpToNextLevel;
window.currentLocation = currentLocation;

function updateLocation(newLocation) {
    currentLocation = newLocation;
    console.log("Aktualna lokalizacja zmieniona na: ", currentLocation);
}

function gainXP(amount) {
    window.xp += amount;
    document.getElementById("xpDisplay").innerText = `XP: ${xp} / ${xpToNextLevel}`;
    checkLevelUp();
}

function checkLevelUp() {
    if (xp >= xpToNextLevel) {
        window.level++;
        window.xp -= xpToNextLevel;
        window.xpToNextLevel = Math.floor(xpToNextLevel * 1.5);

        document.getElementById("levelDisplay").innerText = `Poziom: ${window.level}`;
        document.getElementById("xpDisplay").innerText = `XP: ${window.xp} / ${window.xpToNextLevel}`;
    }
}

function checkGameProgress() {
    if (squatCount === 5) {
        window.playerState.storyFlags["Five_Squats"] = true;
    }
}

function updateSquatCounter(poseLandmarks) {
    const requiredLandmarks = [23, 25, 27, 24, 26, 28]; 

    if (!checkPoseVisibility(requiredLandmarks, poseLandmarks)) {
        return;
    }

    const leftHip = poseLandmarks[23];
    const leftKnee = poseLandmarks[25];
    const leftAnkle = poseLandmarks[27];

    const rightHip = poseLandmarks[24];
    const rightKnee = poseLandmarks[26];
    const rightAnkle = poseLandmarks[28];

    if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle ||
        leftHip.visibility < 0.5 || leftKnee.visibility < 0.5 || leftAnkle.visibility < 0.5 || 
        rightHip.visibility < 0.5 || rightKnee.visibility < 0.5 || rightAnkle.visibility < 0.5) {
            document.getElementById("errorDisplay").innerText = "Część sylwetki jest niewidoczna. Ustaw się prawidłowo.";
            return;
    } else {
        document.getElementById("errorDisplay").innerText = "Cała sylwetka widoczna, gratulacje!";
    }

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const averageKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    if (averageKneeAngle < 70 && !isSquatting) {
        isSquatting = true; 
    } else if (averageKneeAngle > 160 && isSquatting) {
        console.log("przysiad zrobiony");
        squatCount++;
        isSquatting = false;
        document.getElementById("squatCounter").innerText = `Przysiady: ${squatCount}`;
        window.playerState.gainXPForPizza(10);
    } 
}

function updateBicepCurlCounter(poseLandmarks) {
    const requiredLandmarks = [11, 13, 15, 12, 14, 16]; 

    if (!checkPoseVisibility(requiredLandmarks, poseLandmarks)) {
        return;
    }

    const leftShoulder = poseLandmarks[11];
    const leftElbow = poseLandmarks[13];
    const leftWrist = poseLandmarks[15];

    const rightShoulder = poseLandmarks[12];
    const rightElbow = poseLandmarks[14];
    const rightWrist = poseLandmarks[16];

    if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist ||
       leftShoulder.visibility < 0.5 || leftElbow.visibility < 0.5 || leftWrist.visibility < 0.5 || 
       rightShoulder.visibility < 0.5 || rightElbow.visibility < 0.5 || rightWrist.visibility < 0.5) {
        document.getElementById("errorDisplay").innerText = "Część sylwetki jest niewidoczna. Ustaw się prawidłowo.";
        return;
    } else {
        document.getElementById("errorDisplay").innerText = "Cała sylwetka widoczna, gratulacje!";
    }

    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const averageElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

    if (averageElbowAngle < 30 && !isCurling) {
        isCurling = true; 
    } else if (averageElbowAngle > 150 && isCurling) {
        console.log("podnoszenie zrobione");
        bicepCurlCount++;
        isCurling = false;
        document.getElementById("bicepCounter").innerText = `Biceps Curls: ${bicepCurlCount}`;
        window.playerState.gainXPForPizza(5);
    }
}

function calculateAngle(A, B, C) {
    const radians = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180) {
        angle = 360 - angle;
    }
    return angle;
}

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        return stream;
    } catch (err) {
        console.error("Błąd podczas uzyskiwania dostępu do kamerki: ", err);
    }
}

async function initMediaPipe(stream) {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
        modelComplexity: 1,
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

async function checkLocationAndStartCamera() {
    console.log("Aktualna lokalizacja: ", currentLocation);

    const videoElement = document.getElementById('video'); 
    const errorDisplay = document.getElementById("errorDisplay");

    if (currentLocation === 'FitnessRoom') {
        console.log("Gracz znajduje się w FitnessRoom. Próba uruchomienia kamerki...");
        if (!videoStream) {
            videoStream = await startCamera();
            if (videoStream) {
                console.log("Kamerka uruchomiona.");
                videoElement.srcObject = videoStream; 
                videoElement.style.display = 'block'; 
                initMediaPipe(videoStream); 
            } else {
                console.log("Nie udało się uruchomić kamerki.");
                errorDisplay.innerText = "Nie udało się uruchomić kamerki."; 
            }
        } else {
            console.log("Kamerka już działa.");
            errorDisplay.innerText = "Kamerka już działa."; 
        }
    } else {
        errorDisplay.innerText = ""; 
        console.log("Gracz nie znajduje się w FitnessRoom. Wyłączanie kamerki...");
        if (videoStream) {
            let tracks = videoStream.getTracks(); 
            tracks.forEach(track => track.stop());
            videoStream = null; 
            videoElement.style.display = 'none';
            console.log("Kamerka wyłączona.");
        } else {
            console.log("Kamerka już była wyłączona.");
        }
        if (pose) {
            pose.close(); 
            console.log("MediaPipe wyłączone.");
        }
    }
}

document.getElementById("cameraButton").addEventListener("click", checkLocationAndStartCamera);
