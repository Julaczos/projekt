function playVideo() {
    const video = document.getElementById("gameVideo");
    const closeButton = document.getElementById("closeVideoButton");
    
    video.style.display = "block"; 
    closeButton.style.display = "block"; 
    video.play(); 
}

function closeVideo() {
    const video = document.getElementById("gameVideo");
    const closeButton = document.getElementById("closeVideoButton");
    
    video.pause(); 
    video.style.display = "none"; 
    closeButton.style.display = "none"; 
}
