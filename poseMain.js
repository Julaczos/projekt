let isSquatting = false;
let isCurling = false;

let currentLocation = 'MainMap';

let videoStream;
let pose;


function updateLocation(newLocation) {
    currentLocation = newLocation;
    console.log("Aktualna lokalizacja zmieniona na: ", currentLocation);
}

function checkGameProgress() {
    if (window.playerState.squatCount >= 3) {
        window.playerState.storyFlags["Five_Squats"] = true;
    }
}

function updateSquatCounter(poseLandmarks) {
    const leftHip = poseLandmarks[23];
    const leftKnee = poseLandmarks[25];
    const leftAnkle = poseLandmarks[27];

    const rightHip = poseLandmarks[24];
    const rightKnee = poseLandmarks[26];
    const rightAnkle = poseLandmarks[28];

    const leftShoulder = poseLandmarks[11];
    const leftElbow = poseLandmarks[13];
    const leftWrist = poseLandmarks[15];

    const rightShoulder = poseLandmarks[12];
    const rightElbow = poseLandmarks[14];
    const rightWrist = poseLandmarks[16];

    if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle ||
        leftHip.visibility < 0.5 || leftKnee.visibility < 0.5 || leftAnkle.visibility < 0.5 || 
        rightHip.visibility < 0.5 || rightKnee.visibility < 0.5 || rightAnkle.visibility < 0.5 || 
        !leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist ||
        leftShoulder.visibility < 0.5 || leftElbow.visibility < 0.5 || leftWrist.visibility < 0.5 || 
        rightShoulder.visibility < 0.5 || rightElbow.visibility < 0.5 || rightWrist.visibility < 0.5) {
            document.getElementById("errorDisplay").innerText = "Część sylwetki jest niewidoczna. Ustaw się prawidłowo.";
            return;
    } else {
        document.getElementById("errorDisplay").innerText = "Cała sylwetka widoczna, gratulacje!";
    }

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

    const averageKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;

    if (averageKneeAngle < 155 && !isSquatting) {
        isSquatting = true; 
    } else if (averageKneeAngle > 160 && isSquatting) {
        console.log("przysiad zrobiony");
        window.playerState.squatCount++;
        isSquatting = false;

        const squatSound = new Audio('/projekt/images/sound.mp3');
        squatSound.play();

        setTimeout(() => {
            squatSound.pause();
            squatSound.currentTime = 0; 
        }, 3000);

        window.playerState.gainXPForPizza(10);
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

    const leftHip = poseLandmarks[23];
    const leftKnee = poseLandmarks[25];
    const leftAnkle = poseLandmarks[27];

    const rightHip = poseLandmarks[24];
    const rightKnee = poseLandmarks[26];
    const rightAnkle = poseLandmarks[28];

    if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist ||
       leftShoulder.visibility < 0.5 || leftElbow.visibility < 0.5 || leftWrist.visibility < 0.5 || rightShoulder.visibility < 0.5 || rightElbow.visibility < 0.5 || rightWrist.visibility < 0.5 ||
       !leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle ||
        leftHip.visibility < 0.5 || leftKnee.visibility < 0.5 || leftAnkle.visibility < 0.5 || 
        rightHip.visibility < 0.5 || rightKnee.visibility < 0.5 || rightAnkle.visibility < 0.5) {
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
        window.playerState.bicepCurlCount++;
        isCurling = false;
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
    if (results.poseLandmarks) {
        updateSquatCounter(results.poseLandmarks);
      //  updateBicepCurlCounter(results.poseLandmarks);
    }
}

async function checkLocationAndStartCamera() {
    console.log("Aktualna lokalizacja: ", currentLocation); 
    
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
        document.getElementById("errorDisplay").innerText = " ";
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

