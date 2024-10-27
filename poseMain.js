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
const canvas = document.getElementById("poseCanvas");
const ctx = canvas.getContext("2d");

window.squatCount = squatCount;
window.bicepCurlCount = bicepCurlCount;
window.level = level;
window.xp = xp;
window.xpToNextLevel = xpToNextLevel;
window.currentLocation = currentLocation;

function updateLocation(newLocation) {
    currentLocation = newLocation;
    console.log("Aktualna lokalizacja zmieniona na: ", currentLocation);
    checkLocationAndStartCamera(); // Sprawdzanie widoczności przycisku i uruchamianie podglądu
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
        xpToNextLevel = Math.floor(xpToNextLevel * 1.5);

        document.getElementById("levelDisplay").innerText = `Poziom: ${window.level}`;
        document.getElementById("xpDisplay").innerText = `XP: ${window.xp} / ${xpToNextLevel}`;
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
        console.log("Przysiad zrobiony");
        window.playerState.squatCount++;
        isSquatting = false;
        document.getElementById("squatCounter").innerText = `Przysiady: ${window.squatCount}`;
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
       leftShoulder.visibility < 0.5 || leftElbow.visibility < 0.5 || leftWrist.visibility < 0.5 || rightShoulder.visibility < 0.5 || rightElbow.visibility < 0.5 || rightWrist.visibility < 0.5) {
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
        console.log("Podnoszenie zrobione");
        window.playerState.bicepCurlCount++;
        isCurling = false;
        document.getElementById("bicepCounter").innerText = `Biceps Curls: ${window.bicepCurlCount}`;
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

async function initMediaPipe() {
    const video = document.getElementById("video"); // Zmieniamy, aby korzystać z elementu wideo

    video.style.display = 'block'; // Ustawiamy wyświetlanie wideo
    video.srcObject = await startCamera(); // Ustawiamy strumień wideo
    video.play(); // Uruchamiamy odtwarzanie

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
}


function onPoseResults(results) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Czyści canvas
    if (results.poseLandmarks) {
        updateSquatCounter(results.poseLandmarks);
        updateBicepCurlCounter(results.poseLandmarks);
        drawLandmarks(results.poseLandmarks); // Rysuje landmarki na canvasie
    }
}

function drawLandmarks(landmarks) {
    landmarks.forEach(landmark => {
        ctx.beginPath();
        ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
    });
}

async function checkLocationAndStartCamera() {
    console.log("Aktualna lokalizacja: ", currentLocation); 
    
    // Sprawdza i aktualizuje widoczność przycisku na podstawie lokalizacji.
    toggleCameraButton();
    
    if (currentLocation === 'FitnessRoom') {
        console.log("Gracz znajduje się w FitnessRoom. Uruchamiam podgląd...");
        await initMediaPipe();
        canvas.style.display = 'block'; // Pokazuje canvas
    } else {
        document.getElementById("errorDisplay").innerText = " ";
        console.log("Gracz nie znajduje się w FitnessRoom. Wyłączanie podglądu...");
        canvas.style.display = 'none'; // Ukrywa canvas
        if (pose) {
            pose.close();
            console.log("MediaPipe wyłączone.");
        }
    }
}

function toggleCameraButton() {
    const cameraButton = document.getElementById("cameraButton");
    cameraButton.style.display = currentLocation === 'FitnessRoom' ? 'block' : 'none';
}

// Dodaj event listener do przycisku
document.getElementById("cameraButton").addEventListener("click", checkLocationAndStartCamera);
