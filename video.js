let isAudioPlaying = false; 


function toggleVideo() {
    const video = document.getElementById("gameVideo");
    const closeButton = document.getElementById("closeVideoButton");
    const videoButton = document.getElementById("videoButton");
    const audio = document.getElementById("backgroundAudio");

    if (video.style.display === "none") {
        video.style.display = "block";
        closeButton.style.display = "block";
        videoButton.style.display = "none";
        video.play();

        if (!audio.paused) {
            audio.pause(); 
        }

        videoButton.textContent = "Zamknij wideo"; 
    } else {
        video.pause();
        video.style.display = "none";
        closeButton.style.display = "none";
        videoButton.style.display = "block";

        if (isAudioPlaying) {
            audio.play();
        }

        videoButton.textContent = "Włącz wideo"; 
    }
}


document.getElementById("backgroundAudio").volume = 0.5;

function toggleAudio() {
    const audio = document.getElementById("backgroundAudio");
    const audioButton = document.getElementById("audioButton");

    if (audio.paused) {
        audio.play();
        isAudioPlaying = true; 
        audioButton.textContent = "Wyłącz audio";
    } else {
        audio.pause();
        isAudioPlaying = false; 
        audioButton.textContent = "Włącz audio";
    }
}

