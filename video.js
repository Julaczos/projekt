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

        let isDragging = false;
        let offsetX, offsetY;

        const video = document.getElementById("gameVideo");

        video.addEventListener("mousedown", (event) => {
            isDragging = true;
            offsetX = event.clientX - video.getBoundingClientRect().left;
            offsetY = event.clientY - video.getBoundingClientRect().top;

            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);
        });

        function mouseMoveHandler(event) {
            if (isDragging) {
                video.style.left = `${event.clientX - offsetX}px`;
                video.style.top = `${event.clientY - offsetY}px`;
            }
        }

        function mouseUpHandler() {
            isDragging = false;

            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
        }
