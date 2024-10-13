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

function updateLocation(newLocation) {
    currentLocation = newLocation;
    console.log("Aktualna lokalizacja zmieniona na: ", currentLocation);
}

function gainXP(amount) {
    xp += amount;
    document.getElementById("xpDisplay").innerText = `XP: ${xp} / ${xpToNextLevel}`;
    checkLevelUp();
}

function checkLevelUp() {
    if (xp >= xpToNextLevel) {
        level++;
        xp -= xpToNextLevel;
        xpToNextLevel = Math.floor(xpToNextLevel * 1.5);

        document.getElementById("levelDisplay").innerText = `Poziom: ${level}`;
        document.getElementById("xpDisplay").innerText = `XP: ${xp} / ${xpToNextLevel}`;
        console.log(`Gratulacje! Osiągnięto poziom ${level}`);
    }
}

function checkGameProgress() {
    if (squatCount >= 10) {
        alert("Gratulacje! Wykonałeś 10 przysiadów, zdobywasz bonus w grze!");
        squatCount = 0; 
    }
}

function updateSquatCounter(poseLandmarks) {
    const leftHip = poseLandmarks[23];
    const leftKnee = poseLandmarks[25];
    const leftAnkle = poseLandmarks[27];

    const rightHip = poseLandmarks[24];
    const rightKnee = poseLandmarks[26];
    const rightAnkle = poseLandmarks[28];

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const averageKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    if (averageKneeAngle < 70 && !isSquatting) {
        isSquatting = true; 
    } else if (averageKneeAngle > 160 && isSquatting) {
        squatCount++;
        isSquatting = false;
        document.getElementById("counter3").innerText = `Przysiady: ${squatCount}`;
        gainXP(10);
        checkGameProgress();  
    }
}

function updateBicepCurlCounter(poseLandmarks) {
    const leftShoulder = poseLandmarks[11];
    const leftElbow = poseLandmarks[13];
    const leftWrist = poseLandmarks[15];

    const rightShoulder = poseLandmarks[12];
    const rightElbow = poseLandmarks[14];
    const rightWrist = poseLandmarks[16];

    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const averageElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

    if (averageElbowAngle < 30 && !isCurling) {
        isCurling = true; 
    } else if (averageElbowAngle > 150 && isCurling) {
        bicepCurlCount++;
        isCurling = false;
        document.getElementById("bicepCounter").innerText = `Biceps Curls: ${bicepCurlCount}`;
        gainXP(5);
        checkGameProgress(); 
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
        alert("Nie można uzyskać dostępu do kamery. Upewnij się, że udzielono odpowiednich uprawnień.");
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
    if (results.poseLandmarks) {
        updateSquatCounter(results.poseLandmarks);
        updateBicepCurlCounter(results.poseLandmarks);
    }
}

async function checkLocationAndStartCamera() {
    console.log("Aktualna lokalizacja: ", currentLocation);  // Sprawdzenie, jaka jest aktualna lokalizacja
    
    if (currentLocation === 'FitnessRoom') {
        console.log("Gracz znajduje się w FitnessRoom. Próba uruchomienia kamerki...");
        if (!videoStream) {
            videoStream = await startCamera();
            if (videoStream) {
                console.log("Kamerka uruchomiona.");
                initMediaPipe(videoStream);
            } else {
                console.log("Nie udało się uruchomić kamerki.");
            }
        } else {
            console.log("Kamerka już działa.");
        }
    } else {
        console.log("Gracz nie znajduje się w FitnessRoom. Wyłączanie kamerki...");
        if (videoStream) {
            let tracks = videoStream.getTracks();
            tracks.forEach(track => track.stop());
            videoStream = null;
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

