function toggleVideo() {
    const video = document.getElementById("gameVideo");
    const closeButton = document.getElementById("closeVideoButton");
    const videoButton = document.getElementById("videoButton");

    if (video.paused) {
        video.style.display = "block";
        closeButton.style.display = "none";
        video.play();
        videoButton.textContent = "Zamknij wideo"; 
    } else {
        video.pause();
        video.style.display = "none";
        closeButton.style.display = "none";
        videoButton.textContent = "Włącz wideo"; 
    }
}
